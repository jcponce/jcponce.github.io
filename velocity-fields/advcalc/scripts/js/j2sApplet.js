// j2sApplet.js (based on JmolCore.js)
// Bob Hanson 7/13/2016 9:43:56 PM
// BH 7/18/2016 4:51:52 PM adds frame title dragging and toFront(), toBack()
// BH 7/25/2016 8:28:57 AM adds 3Dialog(fDone, asBytes)

if(typeof(jQuery)=="undefined") alert ("Note -- jQuery is required, but it's not defined.")

self.J2S || (J2S = {});

if (!J2S._version)
J2S = (function(document) {
	var z=J2S.z || 9000;
	var getZOrders = function(z) {
		return {
			rear:z++,
			header:z++,
			main:z++,
			content:z++,
			front:z++,
			fileOpener:z++,
			coverImage:z++,
			dialog:z++, // could be several of these, JSV only
			menu:z+90000, // way front
			console:z+91000, // even more front
      consoleImage:z+91001, // bit more front; increments
			monitorZIndex:z+99999 // way way front
		}
	};
  
	var j = {
    
		_version: "$Date: 2015-12-20 16:06:27 -0600 (Sun, 20 Dec 2015) $", // svn.keywords:lastUpdated
		_alertNoBinary: true,
		_allowedAppletSize: [25, 2048, 500],   // min, max, default (pixels)
		/*  By setting the J2S.allowedJmolSize[] variable in the webpage
				before calling J2S.getApplet(), limits for applet size can be overriden.
				2048 standard for GeoWall (http://geowall.geo.lsa.umich.edu/home.html)
		*/
		_appletCssClass: "",
		_appletCssText: "",
		_fileCache: null, // enabled by J2S.setFileCaching(applet, true/false)
		_jarFile: null,  // can be set in URL using _JAR=
		_j2sPath: null,  // can be set in URL using _J2S=
		_use: null,      // can be set in URL using _USE=
		_j2sLoadMonitorOpacity: 90, // initial opacity for j2s load monitor message
		_applets: {},
		_asynchronous: true,
		_ajaxQueue: [],
    _persistentMenu: false,
		_getZOrders: getZOrders,
		_z:getZOrders(z),
		_debugCode: true,  // set false in process of minimization
		db: {
			_DirectDatabaseCalls:{
				// these sites are known to implement access-control-allow-origin * 
			},
		},
		_debugAlert: false,
		_document: document,
		_isXHTML: false,
		_lastAppletID: null,
		_mousePageX: null,
		_mouseOwner: null,
		_serverUrl: "https://your.server.here/jsmol.php",
		_syncId: ("" + Math.random()).substring(3),
		_touching: false,
		_XhtmlElement: null,
		_XhtmlAppendChild: false
	}
  j.z = z;
	var ref = document.location.href.toLowerCase();
	j._httpProto = (ref.indexOf("https") == 0 ? "https://" : "http://"); 
	j._isFile = (ref.indexOf("file:") == 0);
	if (j._isFile) // ensure no attempt to read XML in local request:
	  $.ajaxSetup({ mimeType: "text/plain" });
	j._ajaxTestSite = j._httpProto + "google.com";
	var isLocal = (j._isFile || ref.indexOf("http://localhost") == 0 || ref.indexOf("http://127.") == 0);
  		// this url is used to Google Analytics tracking of Jmol use. You may remove it or modify it if you wish. 
	j._tracker = (!isLocal && 'https://chemapps.stolaf.edu/jmol/JmolTracker.htm?id=UA-45940799-1');
	
	j._isChrome = (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0);
	j._isSafari = (!j._isChrome && navigator.userAgent.toLowerCase().indexOf("safari") >= 0);
	j._isMsie = (window.ActiveXObject !== undefined);
  j._isEdge = (navigator.userAgent.indexOf("Edge/") >= 0);
	j._useDataURI = !j._isSafari && !j._isMsie && !j._isEdge; // safari may be OK here -- untested

  window.requestAnimationFrame || (window.requestAnimationFrame = window.setTimeout);
	for(var i in J2S) j[i] = J2S[i]; // allows pre-definition
	return j;
})(document, J2S);


(function (J2S) {

  J2S.extend = function(map, map0, key0) {
    for (key in map) {
      var val = map[key]
      var a = (key0 ? map0[key0] : J2S);
      if (a[key] && typeof val == "object" && typeof key == "object") {
        J2S.extend(val, a, key);
        continue;
      } else {
        a = val;
      }
    }
  }
})(J2S);

(function (J2S, $) {

  J2S.__$ = $; // local jQuery object -- important if any other module needs to access it (JSmolMenu, for example)

// this library is organized into the following sections:

	// jQuery interface 
	// protected variables
	// feature detection
	// AJAX-related core functionality
	// applet start-up functionality
	// misc core functionality
	// mouse events


	////////////////////// jQuery interface ///////////////////////

	// hooks to jQuery -- if you have a different AJAX tool, feel free to adapt.
	// There should be no other references to jQuery in all the JSmol libraries.

	// automatically switch to returning HTML after the page is loaded
	$(document).ready(function(){ J2S._document = null });

	J2S.$ = function(objectOrId, subdiv) {
		// if a subdiv, then return $("#objectOrId._id_subdiv") 
		// or if no subdiv, then just $(objectOrId)
		if (objectOrId == null)alert (subdiv + arguments.callee.caller.toString());
			return $(subdiv ? "#" + objectOrId._id + "_" + subdiv : objectOrId);
	} 

	J2S._$ = function(id) {
		// either the object or $("#" + id)
		return (typeof id == "string" ? $("#" + id) : id);
	}

	/// special functions:

	J2S.$ajax = function (info) {
    info.url = fixProtocol(info.url);
		J2S._ajaxCall = info.url;
		info.cache = (info.cache != "NO");    
		return $.ajax(info);
	}


  var fixProtocol = function(url) {
    // force https if page is https
  	if (J2S._httpProto == "https://" && url.indexOf("http://") == 0)
  		url = "https" + url.substring(4);
    return url;
  }
  
	J2S.$appEvent = function(app, subdiv, evt, f) {
		var o = J2S.$(app, subdiv); 
		o.off(evt) && f && o.on(evt, f);
	}   

	J2S.$resize = function (f) {
		return $(window).resize(f);
	}

	//// full identifier expected (could be "body", for example):

	J2S.$after = function (what, s) {
		return $(what).after(s);
	}

	J2S.$append = function (what, s) {
		return $(what).append(s);
	}

	J2S.$bind = function(what, list, f) {
		return (f ? $(what).bind(list, f) : $(what).unbind(list));
	}

	J2S.$closest = function(what, d) {
		return $(what).closest(d);
	}
	
	J2S.$get = function(what, i) {
	return $(what).get(i);
	}
 
	// element id expected
			 
	J2S.$documentOff = function(evt, id) {
		return $(document).off(evt, "#" + id);
	}

	J2S.$documentOn = function(evt, id, f) {
		return $(document).on(evt, "#" + id, f);
	}

	J2S.$getAncestorDiv = function(id, className) {
		return $("div." + className + ":has(#" + id + ")")[0];
	}

	J2S.$supportsIECrossDomainScripting = function() {
		return $.support.iecors;
	}

	//// element id or jQuery object expected:

	J2S.$attr = function (id, a, val) {
		return J2S._$(id).attr(a, val);
	}

	J2S.$css = function(id, style) {
		return J2S._$(id).css(style);
	}
	 
	J2S.$find = function(id, d) {
		return J2S._$(id).find(d);
	}
	
	J2S.$focus = function(id) {
		return J2S._$(id).focus();
	}

	J2S.$html = function(id, html) {
		return J2S._$(id).html(html);
	}
	 
	J2S.$offset = function(id) {
		return J2S._$(id).offset();
	}

	J2S.$windowOn = function(evt, f) {
		return $(window).on(evt, f);
	}

	J2S.$prop = function(id, p, val) {
		var o = J2S._$(id);
		return (arguments.length == 3 ? o.prop(p, val) : o.prop(p));
	}

	J2S.$remove = function(id) {
		return J2S._$(id).remove();
	}

	J2S.$scrollTo = function (id, n) {
		var o = J2S._$(id);
		return o.scrollTop(n < 0 ? o[0].scrollHeight : n);
	}

	J2S.$setEnabled = function(id, b) {
		return J2S._$(id).attr("disabled", b ? null : "disabled");  
	}

  J2S.$getSize = function(id) {
		var o = J2S._$(id);
    return [ o.width(), o.height() ]
  }
  
	J2S.$setSize = function(id, w, h) {
		return J2S._$(id).width(w).height(h);
	}

	J2S.$setVisible = function(id, b) {
		var o = J2S._$(id);
		return (b ? o.show() : o.hide());  
	}

	J2S.$submit = function(id) {
		return J2S._$(id).submit();
	}

	J2S.$val = function (id, v) {
		var o = J2S._$(id);
		return (arguments.length == 1 ? o.val() : o.val(v));
	}

	////////////// protected variables ///////////


	J2S._clearVars = function() {
		// only on page closing -- appears to improve garbage collection

		delete jQuery;
		delete $;
		delete J2S;
		delete SwingController;
		delete J;
		delete JM;
		delete JS;
		delete JSV;
		delete JU;
		delete JV;
		delete java;
		delete javajs;
		delete Clazz;
		delete c$; // used in p0p; could be gotten rid of
	}

	////////////// feature detection ///////////////

	J2S.featureDetection = (function(document, window) {

		var features = {};
		features.ua = navigator.userAgent.toLowerCase()

		features.os = (function(){
			var osList = ["linux","unix","mac","win"]
			var i = osList.length;

			while (i--){
				if (features.ua.indexOf(osList[i])!=-1) return osList[i]
			}
			return "unknown";
		})();

		features.browser = function(){
			var ua = features.ua;
			var browserList = ["konqueror","webkit","omniweb","opera","webtv","icab","msie","mozilla"];
			for (var i = 0; i < browserList.length; i++)
			if (ua.indexOf(browserList[i])>=0) 
				return browserList[i];
			return "unknown";
		}
		features.browserName = features.browser();
		features.browserVersion= parseFloat(features.ua.substring(features.ua.indexOf(features.browserName)+features.browserName.length+1));
		features.supportsXhr2 = function() {return ($.support.cors || $.support.iecors)}
		features.allowDestroy = (features.browserName != "msie");
		features.allowHTML5 = (features.browserName != "msie" || navigator.appVersion.indexOf("MSIE 8") < 0);
		features.getDefaultLanguage = function() {
			return navigator.language || navigator.userLanguage || "en-US";
		};

		features._webGLtest = 0;

		features.supportsWebGL = function() {
		if (!J2S.featureDetection._webGLtest) { 
			var canvas;
			J2S.featureDetection._webGLtest = ( 
				window.WebGLRenderingContext 
					&& ((canvas = document.createElement("canvas")).getContext("webgl") 
				|| canvas.getContext("experimental-webgl")) ? 1 : -1);
		}
		return (J2S.featureDetection._webGLtest > 0);
	};

	features.supportsLocalization = function() {
		//<meta charset="utf-8">                                     
		var metas = document.getElementsByTagName('meta'); 
		for (var i= metas.length; --i >= 0;) 
			if (metas[i].outerHTML.toLowerCase().indexOf("utf-8") >= 0) return true;
		return false;
		};

	features.supportsJava = function() {
		if (!J2S.featureDetection._javaEnabled) {
			if (J2S._isMsie) {
				if (!navigator.javaEnabled()) {
					J2S.featureDetection._javaEnabled = -1;
				} else {
					//more likely -- would take huge testing
					J2S.featureDetection._javaEnabled = 1;
				}
			} else {
				J2S.featureDetection._javaEnabled = (navigator.javaEnabled() && (!navigator.mimeTypes || navigator.mimeTypes["application/x-java-applet"]) ? 1 : -1);
			}
		}
		return (J2S.featureDetection._javaEnabled > 0);
	};

	features.compliantBrowser = function() {
		var a = !!document.getElementById;
		var os = features.os;
		// known exceptions (old browsers):
		if (features.browserName == "opera" && features.browserVersion <= 7.54 && os == "mac"
			|| features.browserName == "webkit" && features.browserVersion < 125.12
			|| features.browserName == "msie" && os == "mac"
			|| features.browserName == "konqueror" && features.browserVersion <= 3.3
		) a = false;
		return a;
	}

	features.isFullyCompliant = function() {
		return features.compliantBrowser() && features.supportsJava();
	}

	features.useIEObject = (features.os == "win" && features.browserName == "msie" && features.browserVersion >= 5.5);
	features.useHtml4Object = (features.browserName == "mozilla" && features.browserVersion >= 5) ||
		(features.browserName == "opera" && features.browserVersion >= 8) ||
		(features.browserName == "webkit"/* && features.browserVersion >= 412.2 && features.browserVersion < 500*/); // 500 is a guess; required for 536.3

	features.hasFileReader = (window.File && window.FileReader);

	return features;

})(document, window);


		////////////// AJAX-related core functionality //////////////

	J2S._preloadCache = {},

	J2S._ajax = function(info) {
		if (!info.async) {
			return J2S.$ajax(info).responseText;
		}
		J2S._ajaxQueue.push(info)
		if (J2S._ajaxQueue.length == 1)
			J2S._ajaxDone()
	}
	J2S._ajaxDone = function() {
		var info = J2S._ajaxQueue.shift();
		info && J2S.$ajax(info);
	}

	J2S._loadSuccess = function(a, fSuccess) {
		if (!fSuccess)
			return;
		J2S._ajaxDone();
		fSuccess(a);
	}

	J2S._loadError = function(fError){
		J2S._ajaxDone();
		J2S.say("Error connecting to server: " + J2S._ajaxCall);  
		null!=fError&&fError()
	}

	J2S._isDatabaseCall = function(query) {
		return (J2S.db._databasePrefixes.indexOf(query.substring(0, 1)) >= 0);
	}

	
	J2S._getDirectDatabaseCall = function(query, checkXhr2) {
		if (checkXhr2 && !J2S.featureDetection.supportsXhr2())
			return query;
		var pt = 2;
		var db;
		var call = J2S.db._DirectDatabaseCalls[query.substring(0,pt)]
      || J2S.db._DirectDatabaseCalls[db = query.substring(0,--pt)];
		if (call) {
			if (db == ":") {
				var ql = query.toLowerCase();
				if (!isNaN(parseInt(query.substring(1)))) {
					query = "cid/" + query.substring(1);
				} else if (ql.indexOf(":smiles:") == 0) {
					call += "?POST?smiles=" + query.substring(8);
					query = "smiles";
				} else if (ql.indexOf(":cid:") == 0) {
					query = "cid/" + query.substring(5);
				} else {
					if (ql.indexOf(":name:") == 0)
						query = query.substring(5);
					else if (ql.indexOf(":cas:") == 0)
						query = query.substring(4);
					query = "name/" + encodeURIComponent(query.substring(pt));
				}
			} else {
				query = encodeURIComponent(query.substring(pt));		
			}
			if (call.indexOf("FILENCI") >= 0) {
				query = query.replace(/\%2F/g, "/");				
				query = call.replace(/\%FILENCI/, query);
			} else {
				query = call.replace(/\%FILE/, query);
			}
		}		
		return query;
	}

	J2S.fixDim = function(x, units) {
		var sx = "" + x;
		return (sx.length == 0 ? (units ? "" : J2S._allowedAppletSize[2]) 
			: sx.indexOf("%") == sx.length - 1 ? sx 
			: (x = parseFloat(x)) <= 1 && x > 0 ? x * 100 + "%" 
			: (isNaN(x = Math.floor(x)) ? J2S._allowedAppletSize[2] 
			: x < J2S._allowedAppletSize[0] ? J2S._allowedAppletSize[0] 
			: x > J2S._allowedAppletSize[1] ? J2S._allowedAppletSize[1] 
			: x)
			+ (units ? units : "")
		);
	}

	J2S._getRawDataFromServer = function(database,query,fSuccess,fError,asBase64,noScript){
	  // note that this method is now only enabled for "_"
	  // server-side processing of database queries was too slow and only useful for 
	  // the IMAGE option, which has been abandoned.
		var s = 
			"?call=getRawDataFromDatabase&database=" + database + (query.indexOf("?POST?") >= 0 ? "?POST?" : "")
				+ "&query=" + encodeURIComponent(query)
				+ (asBase64 ? "&encoding=base64" : "")
				+ (noScript ? "" : "&script=" + encodeURIComponent(J2S._getScriptForDatabase(database)));
		return J2S._contactServer(s, fSuccess, fError);
	}

	J2S._checkFileName = function(applet, fileName, isRawRet) {
		if (J2S._isDatabaseCall(fileName)) {
			if (isRawRet && J2S._setQueryTerm)
				J2S._setQueryTerm(applet, fileName);
			fileName = J2S._getDirectDatabaseCall(fileName, true);
			if (J2S._isDatabaseCall(fileName)) {
				// xhr2 not supported (MSIE)
				fileName = J2S._getDirectDatabaseCall(fileName, false);
				isRawRet && (isRawRet[0] = true);
			}
		}
		return fileName;
	}
	
	J2S._checkCache = function(applet, fileName, fSuccess) {
		if (applet._cacheFiles && J2S._fileCache && !fileName.endsWith(".js")) {
			var data = J2S._fileCache[fileName];
			if (data) {
				System.out.println("using "  + data.length + " bytes of cached data for "  + fileName);
				fSuccess(data);
				return null;
			} else {
				fSuccess = function(fileName, data) { fSuccess(J2S._fileCache[fileName] = data) };     
			}
		}
		return fSuccess;
	}
	
	J2S._loadFileData = function(applet, fileName, fSuccess, fError){
		var isRaw = [];
		fileName = J2S._checkFileName(applet, fileName, isRaw);
		fSuccess = J2S._checkCache(applet, fileName, fSuccess);
		if (isRaw[0]) {
				J2S._getRawDataFromServer("_",fileName,fSuccess,fError);   
				return;
		} 
		var info = {
			type: "GET",
			dataType: "text",
			url: fileName,
			async: J2S._asynchronous,
			success: function(a) {J2S._loadSuccess(a, fSuccess)},
			error: function() {J2S._loadError(fError)}
		}
		J2S._checkAjaxPost(info);
		J2S._ajax(info);
	}

	J2S._checkAjaxPost = function(info) {
		var pt = info.url.indexOf("?POST?");
		if (pt > 0) {
			info.data = info.url.substring(pt + 6);
			info.url = info.url.substring(0, pt);
			info.type = "POST";
			info.contentType = "application/x-www-form-urlencoded";
		}
	}
	J2S._contactServer = function(data,fSuccess,fError){
		var info = {
			dataType: "text",
			type: "GET",
			url: J2S._serverUrl + data,
			success: function(a) {J2S._loadSuccess(a, fSuccess)},
			error:function() { J2S._loadError(fError) },
			async:fSuccess ? J2S._asynchronous : false
		}
		J2S._checkAjaxPost(info);
		return J2S._ajax(info);
	}

	J2S._syncBinaryOK="?";

	J2S._canSyncBinary = function(isSilent) {
		if (J2S._isAsync) return true;
		if (self.VBArray) return (J2S._syncBinaryOK = false);
		if (J2S._syncBinaryOK != "?") return J2S._syncBinaryOK;
		J2S._syncBinaryOK = true;
		try {
			var xhr = new window.XMLHttpRequest();
			xhr.open( "text", J2S._ajaxTestSite, false );
			if (xhr.hasOwnProperty("responseType")) {
				xhr.responseType = "arraybuffer";
			} else if (xhr.overrideMimeType) {
				xhr.overrideMimeType('text/plain; charset=x-user-defined');
			}
		} catch( e ) {
			var s = "JSmolCore.js: synchronous binary file transfer is requested but not available";
			System.out.println(s);
			if (J2S._alertNoBinary && !isSilent)
				alert (s)
			return J2S._syncBinaryOK = false;
		}
		return true;  
	}

	J2S._binaryTypes = [".gz",".jpg",".gif",".png",".zip",".jmol",".bin",".smol",".spartan",".mrc",".pse", ".map", ".omap", 
  ".dcd"];

	J2S._isBinaryUrl = function(url) {
		for (var i = J2S._binaryTypes.length; --i >= 0;)
			if (url.indexOf(J2S._binaryTypes[i]) >= 0) return true;
		return false;
	}

	J2S._getFileData = function(fileName, fSuccess, doProcess) {
		var pc = J2S._preloadCache[fileName];
		if (pc) {
			console.log("found " + fileName + " in cache");
			J2S._preloadCache[fileName] = '';
			return pc;
		}
		console.log("loading " + fileName);
    // swingjs.api.J2SInterface
		// use host-server PHP relay if not from this host
		var isBinary = J2S._isBinaryUrl(fileName);
		var isPDB = (fileName.indexOf("pdb.gz") >= 0 && fileName.indexOf("//www.rcsb.org/pdb/files/") >= 0);
		var asBase64 = (isBinary && !J2S._canSyncBinary(isPDB));
		if (asBase64 && isPDB) {
			// avoid unnecessary binary transfer
			fileName = fileName.replace(/pdb\.gz/,"pdb");
			asBase64 = isBinary = false;
		}
		var isPost = (fileName.indexOf("?POST?") >= 0);
		if (fileName.indexOf("file:/") == 0 && fileName.indexOf("file:///") != 0)
			fileName = "file://" + fileName.substring(5);      /// fixes IE problem
		var isMyHost = (fileName.indexOf("://") < 0 || fileName.indexOf(document.location.protocol) == 0 && fileName.indexOf(document.location.host) >= 0);
    var isHttps2Http = (J2S._httpProto == "https://" && fileName.indexOf("http://") == 0);
		var isDirectCall = J2S._isDirectCall(fileName);
		//if (fileName.indexOf("http://pubchem.ncbi.nlm.nih.gov/") == 0)isDirectCall = false;

		var cantDoSynchronousLoad = (!isMyHost && J2S.$supportsIECrossDomainScripting());
		var data = null;
		if (isHttps2Http || asBase64 || !isMyHost && !isDirectCall || !fSuccess && cantDoSynchronousLoad ) {
				data = J2S._getRawDataFromServer("_",fileName, fSuccess, fSuccess, asBase64, true);
		} else {
			fileName = fileName.replace(/file:\/\/\/\//, "file://"); // opera
			var info = {dataType:(isBinary ? "binary" : "text"),async:!!fSuccess};
			if (isPost) {
				info.type = "POST";
				info.url = fileName.split("?POST?")[0]
				info.data = fileName.split("?POST?")[1]
			} else {
				info.type = "GET";
				info.url = fileName;
			}
			if (fSuccess) {
				info.success = function(data) { fSuccess(J2S._xhrReturn(info.xhr))};
				info.error = function() { fSuccess(info.xhr.statusText)};
			}
			info.xhr = J2S.$ajax(info);
			if (!fSuccess) {
				data = J2S._xhrReturn(info.xhr);
			}
		}
		if (!doProcess)
			return data;
		if (data == null) {
			data = "";
			isBinary = false;
		}
		isBinary && (isBinary = J2S._canSyncBinary(true));
		return (isBinary ? J2S._strToBytes(data) : JU.SB.newS(data));
	}
	
	J2S._xhrReturn = function(xhr){
		if (!xhr.responseText || self.Clazz && Clazz.instanceOf(xhr.response, self.ArrayBuffer)) {
			// Safari or error 
			return xhr.response || xhr.statusText;
		} 
		return xhr.responseText;
	}

	J2S._isDirectCall = function(url) {
		for (var key in J2S.db._DirectDatabaseCalls) {
			if (key.indexOf(".") >= 0 && url.indexOf(key) >= 0)
				return true;
		}
		return false;
	}

	J2S._cleanFileData = function(data) {
		if (data.indexOf("\r") >= 0 && data.indexOf("\n") >= 0) {
			return data.replace(/\r\n/g,"\n");
		}
		if (data.indexOf("\r") >= 0) {
			return data.replace(/\r/g,"\n");
		}
		return data;
	};

	J2S._getFileType = function(name) {
		var database = name.substring(0, 1);
		if (database == "$" || database == ":")
			return "MOL";
		if (database == "=")
			return (name.substring(1,2) == "=" ? "LCIF" : "PDB");
		// just the extension, which must be PDB, XYZ..., CIF, or MOL
		name = name.split('.').pop().toUpperCase();
		return name.substring(0, Math.min(name.length, 3));
	};

	J2S._getZ = function(applet, what) {
		return applet && applet._z && applet._z[what] || J2S._z[what];
	}
	
	J2S._incrZ = function(applet, what) {
		return applet && applet._z && ++applet._z[what] || ++J2S._z[what];
	}
	
	J2S._loadFileAsynchronously = function(fileLoadThread, applet, fileName, appData) {
		if (fileName.indexOf("?") != 0) {
			// LOAD ASYNC command
			var fileName0 = fileName;
			fileName = J2S._checkFileName(applet, fileName);
			var fSuccess = function(data) {J2S._setData(fileLoadThread, fileName, fileName0, data, appData)};
			fSuccess = J2S._checkCache(applet, fileName, fSuccess);
			if (fileName.indexOf("|") >= 0)
				fileName = fileName.split("|")[0];
			return (fSuccess == null ? null : J2S._getFileData(fileName, fSuccess));		
		}
		// we actually cannot suggest a fileName, I believe.
		if (!J2S.featureDetection.hasFileReader)
				return fileLoadThread.setData("Local file reading is not enabled in your browser", null, null, appData);
		if (!applet._localReader) {
			var div = '<div id="ID" style="z-index:'+J2S._getZ(applet, "fileOpener") + ';position:absolute;background:#E0E0E0;left:10px;top:10px"><div style="margin:5px 5px 5px 5px;"><input type="file" id="ID_files" /><button id="ID_loadfile">load</button><button id="ID_cancel">cancel</button></div><div>'
			J2S.$after("#" + applet._id + "_appletdiv", div.replace(/ID/g, applet._id + "_localReader"));
			applet._localReader = J2S.$(applet, "localReader");
		}
		J2S.$appEvent(applet, "localReader_loadfile", "click");
		J2S.$appEvent(applet, "localReader_loadfile", "click", function(evt) {
			var file = J2S.$(applet, "localReader_files")[0].files[0];   
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) { // DONE == 2
					J2S.$css(J2S.$(applet, "localReader"), {display : "none"});
					J2S._setData(fileLoadThread, file.name, file.name, evt.target.result, appData);
				}
			};
			reader.readAsArrayBuffer(file);
		});
		J2S.$appEvent(applet, "localReader_cancel", "click");
		J2S.$appEvent(applet, "localReader_cancel", "click", function(evt) {
			J2S.$css(J2S.$(applet, "localReader"), {display: "none"});
			fileLoadThread.setData(null, null, null, appData);
		});
		J2S.$css(J2S.$(applet, "localReader"), {display : "block"});
	}

  J2S._setData = function(fileLoadThread, filename, filename0, data, appData) {
  	data = J2S._strToBytes(data);
		if (filename.indexOf(".jdx") >= 0)
			J2S.Cache.put("cache://" + filename, data);
		fileLoadThread.setData(filename, filename0, data, appData);
  }
  
	J2S._toBytes = function(data) {
	if (typeof data == "string") 
		return data.getBytes();
	// ArrayBuffer assumed here
	data = new Uint8Array(data);
	var b = Clazz.newByteArray(data.length, 0);
		for (var i = data.length; --i >= 0;)
			b[i] = data[i];
	return b;
	}

  J2S._getFileFromDialog = function(fDone, format) {
    // streamlined file dialog using <input type="file">.click()
    format || (format = "string");
    var x = document.createElement("input");
    x.type="file";
    x.onchange=function(ev){
      var file = this.files[0];
      var reader = new FileReader();
      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
          var data = evt.target.result;
          if (format != "ArrayBuffer") {
            data = J2S._toBytes(data);
            if (format == "string")
              data = String.instantialize(data);
          }
        }
        fDone(data, file.name);
      };
      reader.readAsArrayBuffer(file);
    };
    x.click();
  }

	J2S._doAjax = function(url, postOut, dataOut) {
		// called by org.J2S.awtjs2d.JmolURLConnection.doAjax()
		url = url.toString();

		if (dataOut != null) 
			return J2S._saveFile(url, dataOut);
		if (postOut)
			url += "?POST?" + postOut;
		return J2S._getFileData(url, null, true);
	}

	// J2S._localFileSaveFunction --  // do something local here; Maybe try the FileSave interface? return true if successful
	 
	J2S._saveFile = function(filename, data, mimetype, encoding) {
		if (J2S._localFileSaveFunction && J2S._localFileSaveFunction(filename, data))
			return "OK";
		var filename = filename.substring(filename.lastIndexOf("/") + 1);
		mimetype || (mimetype = (filename.indexOf(".pdf") >= 0 ? "application/pdf" 
			: filename.indexOf(".png") >= 0 ? "image/png" 
			: filename.indexOf(".gif") >= 0 ? "image/gif" 
			: filename.indexOf(".jpg") >= 0 ? "image/jpg" : ""));
		var isString = (typeof data == "string");
		if (!isString)
			data = (JU ? JU : J.util).Base64.getBase64(data).toString();
		encoding || (encoding = (isString ? "" : "base64"));
		var url = J2S._serverUrl;
		url && url.indexOf("your.server") >= 0 && (url = "");
		if (J2S._useDataURI || !url) {
			// Asynchronous output generated using an anchor tag
			encoding || (data = btoa(data));
			var a = document.createElement("a");
			a.href = "data:" + mimetype + ";base64," + data;
			a.type = mimetype || (mimetype = "text/plain");	
			a.download = filename;
			a.target = "_blank";
				$("body").append(a);
			a.click();
			a.remove();		
		} else {
		// Asynchronous output to be reflected as a download
			if (!J2S._formdiv) {
					var sform = '<div id="__jsmolformdiv__" style="display:none">\
						<form id="__jsmolform__" method="post" target="_blank" action="">\
						<input name="call" value="saveFile"/>\
						<input id="__jsmolmimetype__" name="mimetype" value=""/>\
						<input id="__jsmolencoding__" name="encoding" value=""/>\
						<input id="__jsmolfilename__" name="filename" value=""/>\
						<textarea id="__jsmoldata__" name="data"></textarea>\
						</form>\
						</div>'
				J2S.$after("body", sform);
				J2S._formdiv = "__jsmolform__";
			}
			J2S.$attr(J2S._formdiv, "action", url + "?" + (new Date()).getMilliseconds());
			J2S.$val("__jsmoldata__", data);
			J2S.$val("__jsmolfilename__", filename);
			J2S.$val("__jsmolmimetype__", mimetype);
			J2S.$val("__jsmolencoding__", encoding);
			J2S.$submit("__jsmolform__");
			J2S.$val("__jsmoldata__", "");
			J2S.$val("__jsmolfilename__", "");
		}
		return "OK";
	}

	J2S._strToBytes = function(s) {
		if (Clazz.instanceOf(s, self.ArrayBuffer))
			return J2S._toBytes(s);
		var b = Clazz.newByteArray(s.length, 0);
		for (var i = s.length; --i >= 0;)
			b[i] = s.charCodeAt(i) & 0xFF;
		return b;
	}

	////////////// applet start-up functionality //////////////

  J2S._findApplet = function(name) {
    // swingjs.api.J2SInterface
		return J2S._applets[name.split("_object")[0]];  
  }
  
  J2S._getJavaVersion = function() {
    // swingjs.api.J2SInterface
    return J2S._version;
  }

	J2S._setAppletThread = function(appletName, myThread) {
    // swingjs.api.J2SInterface
    J2S._applets[appletName + "_thread"] = myThread;
	}

	J2S._setConsoleDiv = function(d) {
		if (!self.Clazz)return;
		Clazz.setConsoleDiv(d);
	}

	J2S._registerApplet = function(id, applet) {
		return window[id] = J2S._applets[id] = J2S._applets[id + "__" + J2S._syncId + "__"] = applet;
	} 

	J2S._readyCallback = function (appId,fullId,isReady,javaApplet,javaAppletPanel) {
    // swingjs.api.J2SInterface
		appId = appId.split("_object")[0];
    var applet = J2S._applets[appId];
		isReady = (isReady.booleanValue ? isReady.booleanValue() : isReady);
		// necessary for MSIE in strict mode -- apparently, we can't call 
		// J2S._readyCallback, but we can call J2S._readyCallback. Go figure...
    if (isReady) {
      // when leaving page, Java applet may be dead 
      applet._appletPanel = (javaAppletPanel || javaApplet);
      applet._applet = javaApplet;
    }
		J2S._track(applet._readyCallback(appId, fullId, isReady));
	}

	J2S._getWrapper = function(applet, isHeader) {

			// id_appletinfotablediv
			//     id_appletdiv
			//     id_coverdiv
			//     id_infotablediv
			//       id_infoheaderdiv
			//          id_infoheaderspan
			//          id_infocheckboxspan
			//       id_infodiv


			// for whatever reason, without DOCTYPE, with MSIE, "height:auto" does not work, 
			// and the text scrolls off the page.
			// So I'm using height:95% here.
			// The table was a fix for MSIE with no DOCTYPE tag to fix the miscalculation
			// in height of the div when using 95% for height. 
			// But it turns out the table has problems with DOCTYPE tags, so that's out. 
			// The 95% is a compromise that we need until the no-DOCTYPE MSIE solution is found. 
			// (100% does not work with the JME linked applet)
		var s;
		// ... here are just for clarification in this code; they are removed immediately
		if (isHeader) {
			var img = ""; 
			if (applet._coverImage){
				var more = " onclick=\"J2S.coverApplet(ID, false)\" title=\"" + (applet._coverTitle) + "\"";
				var play = "<image id=\"ID_coverclickgo\" src=\"" + applet._j2sPath + "/img/play_make_live.jpg\" style=\"width:25px;height:25px;position:absolute;bottom:10px;left:10px;"
					+ "z-index:" + J2S._getZ(applet, "coverImage")+";opacity:0.5;\"" + more + " />"  
				img = "<div id=\"ID_coverdiv\" style=\"background-color:red;z-index:" + J2S._getZ(applet, "coverImage")+";width:100%;height:100%;display:inline;position:absolute;top:0px;left:0px\"><image id=\"ID_coverimage\" src=\""
				 + applet._coverImage + "\" style=\"width:100%;height:100%\"" + more + "/>" + play + "</div>";
			}
			var css = J2S._appletCssText.replace(/\'/g,'"');
			css = (css.indexOf("style=\"") >= 0 ? css.split("style=\"")[1] : "\" " + css);
			s = "\
...<div id=\"ID_appletinfotablediv\" style=\"width:Wpx;height:Hpx;position:relative;font-size:14px;text-align:left\">IMG\
......<div id=\"ID_appletdiv\" style=\"z-index:" + J2S._getZ(applet, "header") + ";width:100%;height:100%;position:absolute;top:0px;left:0px;" + css + ">";
			var height = applet._height;
			var width = applet._width;
			if (typeof height !== "string" || height.indexOf("%") < 0) 
				height += "px";
			if (typeof width !== "string" || width.indexOf("%") < 0)
				width += "px";
			s = s.replace(/IMG/, img).replace(/Hpx/g, height).replace(/Wpx/g, width);
		} else {
			s = "\
......</div>\
......<div id=\"ID_2dappletdiv\" style=\"position:absolute;width:100%;height:100%;overflow:hidden;display:none\"></div>\
......<div id=\"ID_infotablediv\" style=\"width:100%;height:100%;position:absolute;top:0px;left:0px\">\
.........<div id=\"ID_infoheaderdiv\" style=\"height:20px;width:100%;background:yellow;display:none\"><span id=\"ID_infoheaderspan\"></span><span id=\"ID_infocheckboxspan\" style=\"position:absolute;text-align:right;right:1px;\"><a href=\"javascript:J2S.showInfo(ID,false)\">[x]</a></span></div>\
.........<div id=\"ID_infodiv\" style=\"position:absolute;top:20px;bottom:0px;width:100%;height:100%;overflow:auto\"></div>\
......</div>\
...</div>";
		}
		return s.replace(/\.\.\./g,"").replace(/[\n\r]/g,"").replace(/ID/g, applet._id);
	}

	J2S._documentWrite = function(text) {
		if (J2S._document) {
				J2S._document.write(text);
		}
		return text;
	}

	J2S._setObject = function(obj, id, Info) {
		obj._id = id;
		obj.__Info = {};
		Info.z && Info.zIndexBase && (J2S._z = J2S._getZOrders(Info.zIndexBase));
		for (var i in Info)
			obj.__Info[i] = Info[i];
		(obj._z = Info.z) || Info.zIndexBase && (obj._z = obj.__Info.z = J2S._getZOrders(Info.zIndexBase));
		obj._width = Info.width;
		obj._height = Info.height;
		obj._noscript = !obj._isJava && Info.noscript;
		obj._console = Info.console;
		obj._cacheFiles = !!Info.cacheFiles;
		obj._viewSet = (Info.viewSet == null || obj._isJava ? null : "Set" + Info.viewSet);
		if (obj._viewSet != null) {
			J2S.View.__init(obj);
			obj._currentView = null;
		}
		!J2S._fileCache && obj._cacheFiles && (J2S._fileCache = {});
		if (!obj._console)
			obj._console = obj._id + "_infodiv";
		if (obj._console == "none")
			obj._console = null;

		obj._color = (Info.color ? Info.color.replace(/0x/,"#") : "#FFFFFF");
		obj._disableInitialConsole = Info.disableInitialConsole;
		obj._noMonitor = Info.disableJ2SLoadMonitor;
		J2S._j2sPath && (Info.j2sPath = J2S._j2sPath);
		obj._j2sPath = Info.j2sPath;
		obj._coverImage = Info.coverImage;
		obj._isCovered = !!obj._coverImage; 
		obj._deferApplet = Info.deferApplet || obj._isCovered && obj._isJava; // must do this if covered in Java
		obj._deferUncover = Info.deferUncover && !obj._isJava; // can't do this with Java
		obj._coverScript = Info.coverScript;
		obj._coverTitle = Info.coverTitle;

		if (!obj._coverTitle)
			obj._coverTitle = (obj._deferApplet ? "activate 3D model" : "3D model is loading...")
		obj._containerWidth = obj._width + ((obj._width==parseFloat(obj._width))? "px":"");
		obj._containerHeight = obj._height + ((obj._height==parseFloat(obj._height))? "px":"");
		obj._info = "";
		obj._infoHeader = obj._jmolType + ' "' + obj._id + '"'
		obj._hasOptions = Info.addSelectionOptions;
		obj._defaultModel = Info.defaultModel;
		obj._readyScript = (Info.script ? Info.script : "");
		obj._readyFunction = Info.readyFunction;
		if (obj._coverImage && !obj._deferApplet)
			obj._readyScript += ";javascript " + id + "._displayCoverImage(false)";
		obj._src = Info.src;

	}

	J2S._addDefaultInfo = function(Info, DefaultInfo) {
		for (var x in DefaultInfo)
			if (typeof Info[x] == "undefined")
				Info[x] = DefaultInfo[x];
		J2S._use && (Info.use = J2S._use);
		if (Info.use.indexOf("SIGNED") >= 0) {
			if (Info.jarFile.indexOf("Signed") < 0)
				Info.jarFile = Info.jarFile.replace(/Applet/,"AppletSigned");
			Info.use = Info.use.replace(/SIGNED/, "JAVA");
			Info.isSigned = true;
		}
	}

	J2S._syncedApplets = [];
	J2S._syncedCommands = [];
	J2S._syncedReady = [];
	J2S._syncReady = false;
	J2S._isJmolJSVSync = false;

	J2S._setReady = function(applet) {
		J2S._syncedReady[applet] = 1;
		var n = 0;
		for (var i = 0; i < J2S._syncedApplets.length; i++) {
			if (J2S._syncedApplets[i] == applet._id) {
				J2S._syncedApplets[i] = applet;
				J2S._syncedReady[i] = 1;
			} else if (!J2S._syncedReady[i]) {
				continue;
			}
			n++;
		}
		if (n != J2S._syncedApplets.length)
			return;
		J2S._setSyncReady();
	}

	J2S._setDestroy = function(applet) {
		//MSIE bug responds to any link click even if it is just a JavaScript call

		if (J2S.featureDetection.allowDestroy)
			J2S.$windowOn('beforeunload', function () { J2S._destroy(applet); } );
	}

	J2S._destroy = function(applet) {
		try {
			if (applet._appletPanel) applet._appletPanel.destroy();
			applet._applet = null;
			J2S._unsetMouse(applet._mouseInterface)
			applet._canvas = null;
			var n = 0;
			for (var i = 0; i < J2S._syncedApplets.length; i++) {
				if (J2S._syncedApplets[i] == applet)
					J2S._syncedApplets[i] = null;
				if (J2S._syncedApplets[i])
					n++;
			}
			if (n > 0)
				return;
			J2S._clearVars();
		} catch(e){}
	}

	////////////// misc core functionality //////////////

	J2S._setSyncReady = function() {
		J2S._syncReady = true;
		var s = ""
		for (var i = 0; i < J2S._syncedApplets.length; i++)
			if (J2S._syncedCommands[i])
				s += "J2S.script(J2S._syncedApplets[" + i + "], J2S._syncedCommands[" + i + "]);"
		setTimeout(s, 50);  
	}

	J2S._mySyncCallback = function(appFullName,msg) {
		app = J2S._applets[appFullName];
		if (app._viewSet) {
			// when can we do this?
//			if (app._viewType == "JSV" && !app._currentView.JMOL)
				J2S.View.updateFromSync(app, msg);
			return;
		}
		if(!J2S._syncReady || !J2S._isJmolJSVSync)
			return 1; // continue processing and ignore me
		for (var i = 0; i < J2S._syncedApplets.length; i++) {
			if (msg.indexOf(J2S._syncedApplets[i]._syncKeyword) >= 0)
				J2S._syncedApplets[i]._syncScript(msg);
		}
		return 0 // prevents further Jmol sync processing 
	}              

	J2S._getElement = function(applet, what) {
		var d = document.getElementById(applet._id + "_" + what);
		return (d || {});
	} 
	 
	J2S._evalJSON = function(s,key){
		s = s + "";
		if(!s)
			return [];
		if(s.charAt(0) != "{") {
			if(s.indexOf(" | ") >= 0)
				s = s.replace(/\ \|\ /g, "\n");
			return s;
		}
		var A = (new Function( "return " + s ) )();
		return (!A ? null : key && A[key] != undefined ? A[key] : A);
	}

	J2S._sortMessages = function(A){
		/*
		 * private function
		 */
		function _sortKey0(a,b){
			return (a[0]<b[0]?1:a[0]>b[0]?-1:0);
		}

		if(!A || typeof (A) != "object")
			return [];
		var B = [];
		for(var i = A.length - 1; i >= 0; i--)
			for(var j = 0, jj= A[i].length; j < jj; j++)
				B[B.length] = A[i][j];
		if(B.length == 0)
			return;
		B = B.sort(_sortKey0);
		return B;
	}

	//////////////////// mouse events //////////////////////

	J2S._jsSetMouse = function(who, isSwingJS) {
      // swingjs.api.J2SInterface
      
      
    var doIgnore = function(ev) { return (J2S._dmouseOwner
        ||  !ev.target || ("" + ev.target.className).indexOf("swingjs-ui") >= 0)
    };
         
    var checkStopPropagation = function(ev, ui, handled) {
      if (!ui || !handled || !ev.target.getAttribute("role")) {
        if (!ui || !ui.textListener)
      			ev.preventDefault();
			  ev.stopPropagation();
      }
      return handled;
    };

		J2S.$bind(who, 'mousedown touchstart', function(ev) {    
      
   //   System.out.println(["j2sApplet DOWN",ev.type,doIgnore(ev),ev.target.id,ev.target.getAttribute("role"),ev.target["data-ui"]]);
      
      if (doIgnore(ev))
        return true;

			J2S._setMouseOwner(who, true);
      var ui = ev.target["data-ui"];
      var handled = (ui && ui.handleJSEvent(who, 501, ev));
      if (checkStopPropagation(ev, ui, handled))
        return true;  
      ui = ev.target["data-component"];
			who.isDragging = true;
			if ((ev.type == "touchstart") && J2S._gestureUpdate(who, ev))
				return !!ui;
			J2S._setConsoleDiv(who.applet._console);
			var xym = J2S._jsGetXY(who, ev);
			if(xym) {
		  	if (ev.button != 2 && J2S.Swing && J2S.Swing.hideMenus)
          J2S.Swing.hideMenus(who.applet);         
        if (who._frameViewer && who._frameViewer.isFrame)
          J2S._setWindowZIndex(who._frameViewer.top.ui.domNode, Integer.MAX_VALUE); 
        who.applet._processEvent(501, xym, ev, who._frameViewer); //MouseEvent.MOUSE_PRESSED
      }
			return !!ui;
		});    

		J2S.$bind(who, 'mouseup touchend', function(ev) {
    
  //    System.out.println(["j2sApplet UP",ev.type, doIgnore(ev),ev.target.id,ev.target.getAttribute("role"),ev.target["data-ui"]]);
      
      
      if (doIgnore(ev))
        return true;
        
      if (ev.target.getAttribute("role")) {
        //System.out.println("trying to hide the menu")
        ev.target._menu._hideJSMenu()
      }
        
			J2S._setMouseOwner(null);
      var ui = ev.target["data-ui"];
      var handled = (ui && ui.handleJSEvent(who, 502, ev));
      if (checkStopPropagation(ev, ui, handled))
        return true;
      ui || (ui = ev.target["data-component"]);
			who.isDragging = false;
			if (ev.type == "touchend" && J2S._gestureUpdate(who, ev))
				return !!ui;
			var xym = J2S._jsGetXY(who, ev);
			if(xym)
  			who.applet._processEvent(502, xym, ev, who._frameViewer);//MouseEvent.MOUSE_RELEASED
			return !!ui;
		});
    
		J2S.$bind(who, 'mousemove touchmove', function(ev) { // touchmove
      if (doIgnore(ev))
        return true;

      if (ev.target.getAttribute("role")) {
        return true;
      }
      
		  // defer to console or menu when dragging within this who
      
			if (J2S._mouseOwner && J2S._mouseOwner != who && J2S._mouseOwner.isDragging) {
        if (!J2S._mouseOwner.mouseMove)
          return true;
	   			J2S._mouseOwner.mouseMove(ev);
				return false;
			}
			return J2S._drag(who, ev);
		});
		
		J2S.$bind(who, 'DOMMouseScroll mousewheel', function(ev) { // Zoom
      if (doIgnore(ev))
        return true;
        
      if (ev.target.getAttribute("role")) {
        return true;
      }
      var ui = ev.target["data-ui"];
      var handled = (ui && ui.handleJSEvent(who, 507, ev));
      if (checkStopPropagation(ev, ui, handled))
        return true;
      ui || (ui = ev.target["data-component"]);
			who.isDragging = false;
      
			var oe = ev.originalEvent;
			var scroll = (oe.detail ? oe.detail : (J2S.featureDetection.os == "mac" ? 1 : -1) * oe.wheelDelta); // Mac and PC are reverse; but 
			var modifiers = getMouseModifiers(ev);
			who.applet._processEvent(507,[scroll < 0 ? -1 : 1,0,modifiers], ev, who._frameViewer);
			return !!ui;
		});

		// context menu is fired on mouse down, not up, and it's handled already anyway.

		J2S.$bind(who, "contextmenu", function() {return false;});

		J2S.$bind(who, 'mouseout', function(ev) {
      if (doIgnore(ev))
        return true;
      if (ev.target.getAttribute("role")) {
        return true;
      }
      
      if (J2S._mouseOwner && !J2S._mouseOwner.mouseMove) 
        J2S._setMouseOwner(null);
			if (who.applet._appletPanel)
				who.applet._appletPanel.startHoverWatcher(false);
			//who.isDragging = false;
			var xym = J2S._jsGetXY(who, ev);
			if (!xym)
				return false;
			//who.applet._processEvent(502, xym, ev);//MouseEvent.MOUSE_RELEASED
			who.applet._processEvent(505, xym, ev);//MouseEvent.MOUSE_EXITED
			return false;
		});

		J2S.$bind(who, 'mouseenter', function(ev) {
      if (doIgnore(ev))
        return true;
      if (ev.target.getAttribute("role")) {
        return true;
      }
      
			if (who.applet._appletPanel)
				who.applet._appletPanel.startHoverWatcher(true);
			if (ev.buttons === 0 || ev.which === 0) {
				who.isDragging = false;
				var xym = J2S._jsGetXY(who, ev);
				if (!xym)
					return false;
				who.applet._processEvent(504, xym, ev, who._frameViewer);//MouseEvent.MOUSE_ENTERED	
				//who.applet._processEvent(502, xym, ev, who._frameViewer);//MouseEvent.MOUSE_RELEASED
				return false;
			}
		});

    if (!isSwingJS) {
    	J2S.$bind(who, 'mousemoveoutjsmol', function(evspecial, target, ev) {
          if (doIgnore(ev))
            return true;
    		if (who == J2S._mouseOwner && who.isDragging)
    			return J2S._drag(who, ev);
        return true;
    	});
  
  		if (who.applet._is2D)
  			J2S.$resize(function() {
  				if (!who.applet)
  					return;
  				who.applet._resize();
  			});
    } 
		J2S.$bind('body', 'mouseup touchend', function(ev) {
      if (doIgnore(ev))
        return true;
			if (who.applet)
				who.isDragging = false;
			J2S._setMouseOwner(null);
      return true;
		});

	}

	J2S._jsUnsetMouse = function(who) {
    if (!who)return;
    // swingjs.api.J2SInterface
  	who.applet = null;
		J2S.$bind(who, 'mousedown touchstart mousemove touchmove mouseup touchend DOMMouseScroll mousewheel contextmenu mouseout mouseenter mousemoveoutjsmol', null);
		J2S._setMouseOwner(null);
	}

	J2S._setMouseOwner = function(who, tf) {
		if (who == null || tf)
			J2S._mouseOwner = who;
		else if (J2S._mouseOwner == who)
			J2S._mouseOwner = null;
	}

	var getMouseModifiers = function(ev) {
		var modifiers = 0;
		switch (ev.button) {
		case 0:
			modifiers = (1<<4)|(1<<10);//InputEvent.BUTTON1 + InputEvent.BUTTON1_DOWN_MASK;
			break;
		case 1:
			modifiers = (1<<3)|(1<<11);//InputEvent.BUTTON2 + InputEvent.BUTTON2_DOWN_MASK;
			break;
		case 2:
			modifiers = (1<<2)|(1<<12);//InputEvent.BUTTON3 + InputEvent.BUTTON3_DOWN_MASK;
			break;
		}
		if (ev.shiftKey)
			modifiers |= (1<<0)|(1<<6); //InputEvent.SHIFT_MASK + InputEvent.SHIFT_DOWN_MASK;
		if (ev.ctrlKey)
			modifiers |= (1<<1)|(1<<7); //InputEvent.CTRL_MASK + InputEvent.CTRL_DOWN_MASK;
		if (ev.metaKey)
			modifiers |= (1<<2)|(1<<8); //InputEvent.META_MASK + InputEvent.META_DOWN_MASK;
		if (ev.altKey)
			modifiers |= (1<<3)|(1<<9); //InputEvent.ALT_MASK + InputEvent.ALT_DOWN_MASK;
		if (ev.altGraphKey)
			modifiers |= (1<<5)|(1<<13); //InputEvent.ALT_GRAPH_MASK + InputEvent.ALT_GRAPH_DOWN_MASK;
		return modifiers;
	}

	J2S._jsGetXY = function(who, ev) {
		if (!who.applet._ready || J2S._touching && ev.type.indexOf("touch") < 0)
			return false;
		//ev.preventDefault(); // removed 5/9/2015 -- caused loss of focus on text-box clicking in SwingJS
		var offsets = J2S.$offset(who.id);
		var x, y;
		var oe = ev.originalEvent;
		// drag-drop jQuery event is missing pageX
		ev.pageX || (ev.pageX = oe.pageX);
		ev.pageY || (ev.pageY = oe.pageY);
		J2S._mousePageX = ev.pageX;
		J2S._mousePageY = ev.pageY;
		if (oe.targetTouches && oe.targetTouches[0]) {
			x = oe.targetTouches[0].pageX - offsets.left;
			y = oe.targetTouches[0].pageY - offsets.top;
		} else if (oe.changedTouches) {
			x = oe.changedTouches[0].pageX - offsets.left;
			y = oe.changedTouches[0].pageY - offsets.top;
		} else {
			x = ev.pageX - offsets.left;
			y = ev.pageY - offsets.top;
		}
    //System.out.println([x,y,getMouseModifiers(ev)])
		return (x == undefined ? null : [Math.round(x), Math.round(y), getMouseModifiers(ev)]);
	}

	J2S._gestureUpdate = function(who, ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var oe = ev.originalEvent;
		switch (ev.type) {
		case "touchstart":
			J2S._touching = true;
			break;
		case "touchend":
			J2S._touching = false;
			break;
		}
		if (!oe.touches || oe.touches.length != 2) return false;
		switch (ev.type) {
		case "touchstart":
			who._touches = [[],[]];
			break;
		case "touchmove":
			var offsets = J2S.$offset(who.id);
			var t0 = who._touches[0];
			var t1 = who._touches[1];
			t0.push([oe.touches[0].pageX - offsets.left, oe.touches[0].pageY - offsets.top]);
			t1.push([oe.touches[1].pageX - offsets.left, oe.touches[1].pageY - offsets.top]);
			var n = t0.length;
			if (n > 3) {
				t0.shift();
				t1.shift();
			}
			if (n >= 2)
				who.applet._processGesture(who._touches, who._frameViewer);
			break;
		}
		return true;
	}

	J2S._drag = function(who, ev) {
    
		ev.stopPropagation();
		ev.preventDefault();
    
		var isTouch = (ev.type == "touchmove");
		if (isTouch && J2S._gestureUpdate(who, ev))
			return false;
		var xym = J2S._jsGetXY(who, ev);
		if(!xym) return false;
    
		if (!who.isDragging)
			xym[2] = 0;

    var ui = ev.target["data-ui"];
    //if (who.isdragging && (!ui || !ui.handleJSEvent(who, 506, ev))) {}
		who.applet._processEvent((who.isDragging ? 506 : 503), xym, ev, who._frameViewer); // MouseEvent.MOUSE_DRAGGED : MouseEvent.MOUSE_MOVED
    ui || (ui = ev.target["data-component"]);
		return !!ui;
	}
	

J2S._track = function(applet) {
	// this function inserts an iFrame that can be used to track your page's applet use. 
	// By default it tracks to a page at St. Olaf College, but you can change that. 
	// and you can use
	//
	// delete J2S._tracker
	//
	// yourself to not have you page execute this 
	//
	if (J2S._tracker){
		try {  
			var url = J2S._tracker + "&applet=" + applet._jmolType + "&version=" + J2S._version 
				+ "&appver=" + J2S.___JmolVersion + "&url=" + encodeURIComponent(document.location.href);
			var s = '<iframe style="display:none" width="0" height="0" frameborder="0" tabindex="-1" src="' + url + '"></iframe>'
			J2S.$after("body", s);
		} catch (e) {
			// ignore
		}
		delete J2S._tracker;
	}
	return applet;
}

var __profiling;

J2S.getProfile = function(doProfile) {
  if (!self.Clazz || !self.JSON)
    return;
  if (!__profiling)
    Clazz._startProfiling(__profiling = (arguments.length == 0 || doProfile));
	return Clazz.getProfile();
}

J2S._getAttr = function(s, a) {
	var pt = s.indexOf(a + "=");
	return (pt >= 0 && (pt = s.indexOf('"', pt)) >= 0 
		? s.substring(pt+1, s.indexOf('"', pt+1)) : null);
}


J2S.Cache = {fileCache: {}};

J2S.Cache.get = function(filename) {
	return J2S.Cache.fileCache[filename];
}

J2S.Cache.put = function(filename, data) {
  J2S.Cache.fileCache[filename] = data;
}

	J2S.Cache.setDragDrop = function(me) {
		J2S.$appEvent(me, "appletdiv", "dragover", function(e) {
			e = e.originalEvent;
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		});
		J2S.$appEvent(me, "appletdiv", "drop", function(e) {
			var oe = e.originalEvent;
			oe.stopPropagation();
			oe.preventDefault();
			var file = oe.dataTransfer.files[0];
			if (file == null) {
				// FF and Chrome will drop an image here
				// but it will be only a URL, not an actual file. 
				try {
				  file = "" + oe.dataTransfer.getData("text");
				  if (file.indexOf("file:/") == 0 || file.indexOf("http:/") == 0) {
				  	me._scriptLoad(file);
				  	return;
			  	}
				} catch(e) {
				  return;
				}
			  // some other format
			  return;
			}
			// MSIE will drop an image this way, though, and load it!
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) {
					var cacheName = "cache://DROP_" + file.name;
					var bytes = J2S._toBytes(evt.target.result);
					if (!cacheName.endsWith(".spt"))
						me._appletPanel.cacheFileByName("cache://DROP_*",false);
					if (me._viewType == "JSV" || cacheName.endsWith(".jdx")) // shared by Jmol and JSV
						J2S.Cache.put(cacheName, bytes);
					else
						me._appletPanel.cachePut(cacheName, bytes);
					var xym = J2S._jsGetXY(me._canvas, e);
					if(xym && (!me._appletPanel.setStatusDragDropped || me._appletPanel.setStatusDragDropped(0, xym[0], xym[1], cacheName))) {
						me._appletPanel.openFileAsyncSpecial(cacheName, 1);
					}
				}
			};
			reader.readAsArrayBuffer(file);
		});
	}
  
})(J2S, jQuery);




// J2S.js -- Java2Script adapter
// author: Bob Hanson, hansonr@stolaf.edu	4/16/2012

;(function (J2S) {

	J2S._isAsync = false; // testing only
	J2S._asyncCallbacks = {};
	
	J2S._coreFiles = []; // required for package.js


///////////////////
// This section provides an asynchronous loading sequence
//

// methods and fields starting with double underscore are private to this .js file

  var __clazzLoaded = false;
	var __execLog = [];
	var __execStack = [];
	var __execTimer = 0;
	var __coreSet = [];
	var __coreMore = [];
	var __execDelayMS = 100; // must be > 55 ms for FF

	var __nextExecution = function(trigger) {
    arguments.length || (trigger = true);
		delete __execTimer;
		var es = __execStack;
		var e;
		while (es.length > 0 && (e = es[0])[4] == "done")
			es.shift();
		if (es.length == 0)
			return;
		if (!J2S._isAsync && !trigger) {
			setTimeout(__nextExecution,10)
			return;
		}
		e.push("done");
		var s = "J2SApplet exec " + e[0]._id + " " + e[3] + " " + e[2];
		if (self.System)
			System.out.println(s);
			//alert(s)
		if (self.console)console.log(s + " -- OK")
		__execLog.push(s);
		e[1](e[0],e[2]);	
	};

	// preload core and applet code asynchronously
	var __loadCore = function(applet) {
		var cd = applet.__Info.code;
		var cf = Clazz._Loader.getClasspathFor(applet.__Info.code);
		var preload = [Clazz._Loader.getJ2SLibBase() + "core/coreswingjs.z.js", cf,

			       // these next two get loaded even though they're in the core?
			       Clazz._Loader.getJ2SLibBase() + "javax/swing/text/AbstractDocument.js", 
			       Clazz._Loader.getJ2SLibBase() + "java/awt/geom/Point2D.js",

			       // can't put css in core, so we need to preload these
			       Clazz._Loader.getJ2SLibBase() + "swingjs/plaf/JSSliderUI.js",
			       Clazz._Loader.getJ2SLibBase() + "swingjs/plaf/JSScrollBarUI.js",
			       Clazz._Loader.getJ2SLibBase() + "swingjs/jquery/JQueryUI.js",
			       Clazz._Loader.getJ2SLibBase() + "swingjs/jquery/jquery-ui-j2sslider.css",
			       Clazz._Loader.getJ2SLibBase() + "swingjs/jquery/jquery-ui-j2sslider.js"
			       ];
		__doPreload(preload);
	};

	var __doPreload = function(preload) {
		var url = preload.shift();
		System.out.println("Loading " + url);
		$.ajax({ url: url, dataType: 'text' }).done(function(response) {
			J2S._preloadCache[url] = response;
			if (preload.length)
				__doPreload(preload);
			else
		    	__nextExecution();
		});
	}

	var __loadClazz = function(applet) {
		if (!__clazzLoaded) {
			__clazzLoaded = true;
			// create the Clazz object
			LoadClazz();
		}
		__nextExecution();
	}

	var __loadClazz2 = function(applet) {
			LoadClazz2();
			if (applet._noMonitor)
				Clazz._LoaderProgressMonitor.showStatus = function() {}
			LoadClazz = null;
      if (applet.__Info.uncompressed)
        Clazz.loadClass(); // for now; allows for no compression 
			Clazz._Loader.onGlobalLoaded = function (file) {
			 // not really.... just nothing more yet to do yet
				Clazz._LoaderProgressMonitor.showStatus("Application loaded.", true);
				if (!J2S._debugCode || !J2S.haveCore) {
					J2S.haveCore = true;
					__nextExecution();
				}
			};
		  // load package.js and j2s/core/core.z.js
			Clazz._Loader.loadPackageClasspath("java", null, true, __nextExecution);
	};

	var __loadClass = function(applet, javaClass) {
		Clazz._Loader.loadClass(javaClass, function() {__nextExecution()});
	};

	J2S.showExecLog = function() { return __execLog.join("\n") }; 

	J2S._addExec = function(e) {
    e[1] || (e[1] = __loadClass);
		var s = "J2SApplet load " + e[0]._id + " " + e[3];
		if (self.console)console.log(s + "...")
		__execLog.push(s);   
		__execStack.push(e);
	}

	J2S._addCoreFile = function(type, path, more) {
  
    // BH 3/15: idea here is that when both Jmol and JSV are present, 
    // we want to load a common core file -- jmoljsv.z.js --
    // instead of just one. Otherwise we do a lot of duplication.
    // It is not clear how this would play with other concurrent
    // apps. So this will take some thinking. But the basic idea is that
    // core file to load is 
     
    type = type.toLowerCase().split(".")[0]; // package name only 

    // return if type is already part of the set.    
		if (__coreSet.join("").indexOf(type) >= 0) return;
    
    // create a concatenated lower-case name for a core file that includes
    // all Java applets on the page
    
		__coreSet.push(type);
		__coreSet.sort();
		J2S._coreFiles = [path + "/core/core" + __coreSet.join("") + ".z.js" ];
		if (more && (more = more.split(" ")))
			for (var i = 0; i < more.length; i++)
				if (__coreMore.join("").indexOf(more[i]) < 0)
					__coreMore.push(path + "/core/core" + more[i] + ".z.js")
		for (var i = 0; i < __coreMore.length; i++)
			J2S._coreFiles.push(__coreMore[i]);
	}      		

	J2S._Canvas2D = function(id, Info, type, checkOnly){
		// type: Jmol or JSV or SwingJS
		this._uniqueId = ("" + Math.random()).substring(3);
		this._id = id;
		this._is2D = true;
		this._isJava = false;
		this._jmolType = "J2S._Canvas2D (" + type + ")";
    this._isLayered = Info._isLayered || false; // JSV or SwingJS are layered
    this._isSwing = Info._isSwing || false;
    this._isJSV = Info._isJSV || false;
    this._isAstex = Info._isAstex || false;            
    this._platform = Info._platform || "";
		if (checkOnly)
			return this;
		window[id] = this;
		this._createCanvas(id, Info);
		if (!J2S._document || this._deferApplet)
			return this;
		this._init();
		return this;
	};

	J2S._setAppletParams = function(availableParams, params, Info, isHashtable) {
		for (var i in Info)
			if(!availableParams || availableParams.indexOf(";" + i.toLowerCase() + ";") >= 0){
				if (Info[i] == null || i == "language" && !J2S.featureDetection.supportsLocalization())
					continue;
				if (isHashtable)
					params.put(i, (Info[i] === true ? Boolean.TRUE: Info[i] === false ? Boolean.FALSE : Info[i]))
				else
					params[i] = Info[i];
			}
	}     
	 
	J2S._jsSetPrototype = function(proto) {
		proto._init = function() {
	 		this._setupJS();
			this._showInfo(true); 
			if (this._disableInitialConsole)
				this._showInfo(false);
		};

		proto._createCanvas = function(id, Info) {
			J2S._setObject(this, id, Info);
			var t = J2S._getWrapper(this, true);
			if (this._deferApplet) {
			} else if (J2S._document) {
				J2S._documentWrite(t);
				this._newCanvas(false);				        
				t = "";
			} else {
				this._deferApplet = true;
				t += '<script type="text/javascript">' + id + '._cover(false)</script>';
			}
			t += J2S._getWrapper(this, false);
			if (Info.addSelectionOptions)
				t += J2S._getGrabberOptions(this);
			if (J2S._debugAlert && !J2S._document)
				alert(t);
			this._code = J2S._documentWrite(t);
		};

		proto._newCanvas = function(doReplace) {
			if (this._is2D)
				this._createCanvas2d(doReplace);
			else
				this._GLmol.create();
		};

//////// swingjs.api.HTML5Applet interface    
    proto._getHtml5Canvas = function() { return this._canvas }; 
    proto._getWidth = function() { return this._canvas.width }; 
    proto._getHeight = function() { return this._canvas.height };
    proto._getContentLayer = function() { return J2S.$(this, "contentLayer")[0] };
    proto._repaintNow = function() { J2S._repaint(this, false) }; 
////////


		proto._createCanvas2d = function(doReplace) {
			var container = J2S.$(this, "appletdiv");
			//if (doReplace) {
      
			try {
			container[0].removeChild(this._canvas);
			if (this._canvas.frontLayer)
				container[0].removeChild(this._canvas.frontLayer);
			if (this._canvas.rearLayer)
				container[0].removeChild(this._canvas.rearLayer);
			if (this._canvas.contentLayer)
				container[0].removeChild(this._canvas.contentLayer);
			J2S._jsUnsetMouse(this._mouseInterface);
			} catch (e) {}
			//}
			var w = Math.round(container.width());
			var h = Math.round(container.height());
			var canvas = document.createElement( 'canvas' );
			canvas.applet = this;
			this._canvas = canvas;
			canvas.style.width = "100%";
			canvas.style.height = "100%";
			canvas.width = w;
			canvas.height = h; // w and h used in setScreenDimension
			canvas.id = this._id + "_canvas2d";
			container.append(canvas);
			J2S._$(canvas.id).css({"z-index":J2S._getZ(this, "main")});
			if (this._isLayered){
				var content = document.createElement("div");
				canvas.contentLayer = content;
				content.id = this._id + "_contentLayer";
				container.append(content);
				J2S._$(content.id).css({zIndex:J2S._getZ(this, "content"),position:"absolute",left:"0px",top:"0px",
        width:(this._isSwing ? w : 0) + "px", height:(this._isSwing ? h : 0) +"px", overflow:"hidden"});
        if (this._isSwing) {
  				this._mouseInterface = content;
          content.applet = this;
        } else {
  				this._mouseInterface = this._getLayer("front", container, w, h, false);
        }
			} else {
				this._mouseInterface = canvas;
			}
			J2S._jsSetMouse(this._mouseInterface, this._isSwing);
		}
    
    proto._getLayer = function(name, container, w, h, isOpaque) {
  		var c = document.createElement("canvas");
			this._canvas[name + "Layer"] = c;
			c.style.width = "100%";
			c.style.height = "100%";
			c.id = this._id + "_" + name + "Layer";
			c.width = w;
			c.height = h; // w and h used in setScreenDimension
			container.append(c);
			c.applet = this;
			J2S._$(c.id).css({background:(isOpaque ? "rgb(0,0,0,1)" : "rgb(0,0,0,0.001)"), "z-index": J2S._getZ(this,name),position:"absolute",left:"0px",top:"0px",overflow:"hidden"});
			return c;	
    }
    
    
		proto._setupJS = function() {
			window["j2s.lib"] = {
				base : this._j2sPath + "/",
				alias : ".",
				console : this._console,
				monitorZIndex : J2S._getZ(this, "monitorZIndex")
			};
			var isFirst = (__execStack.length == 0);
			if (isFirst) {
				J2S._addExec([this, __loadClazz, null, "loadClazz"]);
				J2S._addExec([this, __loadCore, null, "loadCore"]);
				J2S._addExec([this, __loadClazz2, null, "loadClazz2"]);
			}
      this._addCoreFiles();
			J2S._addExec([this, this.__startAppletJS, null, "start applet"])
			this._isSigned = true; // access all files via URL hook
			this._ready = false; 
			this._applet = null;
			this._canScript = function(script) {return true;};
			this._savedOrientations = [];
			__execTimer && clearTimeout(__execTimer);
			__execTimer = setTimeout(__nextExecution, __execDelayMS);
		};

		proto.__startAppletJS = function(applet) {
			if (J2S._version.indexOf("$Date: ") == 0)
				J2S._version = (J2S._version.substring(7) + " -").split(" -")[0] + " (J2S)"
			var viewerOptions = Clazz._4Name("java.util.Hashtable").newInstance();
			J2S._setAppletParams(applet._availableParams, viewerOptions, applet.__Info, true);
			viewerOptions.put("appletReadyCallback","J2S._readyCallback");
			viewerOptions.put("applet", true);
			viewerOptions.put("name", applet._id);// + "_object");
			viewerOptions.put("syncId", J2S._syncId);
			if (J2S._isAsync)
				viewerOptions.put("async", true);
			if (applet._color) 
				viewerOptions.put("bgcolor", applet._color);
			if (applet._startupScript)
				viewerOptions.put("script", applet._startupScript)
			if (J2S._syncedApplets.length)
				viewerOptions.put("synccallback", "J2S._mySyncCallback");
			viewerOptions.put("signedApplet", "true");
			viewerOptions.put("platform", applet._platform);
			if (applet._is2D)
				viewerOptions.put("display",applet._id + "_canvas2d");

			// viewerOptions.put("repaintManager", "J.render");
			viewerOptions.put("documentBase", document.location.href);
			var codePath = applet._j2sPath + "/";
      
			if (codePath.indexOf("://") < 0) {
				var base = document.location.href.split("#")[0].split("?")[0].split("/");
				if (codePath.indexOf("/") == 0)
					base = [base[0], codePath.substring(1)];
				else
					base[base.length - 1] = codePath;
				codePath = base.join("/");
			}
			viewerOptions.put("codePath", codePath);
			J2S._registerApplet(applet._id, applet);
			try {
				applet._newApplet(viewerOptions);
			} catch (e) {
				System.out.println((J2S._isAsync ? "normal async abort from " : "") + e);
				return;
			}
      
			applet._jsSetScreenDimensions();
			__nextExecution();
		};

    if (!proto._restoreState)
	   	proto._restoreState = function(clazzName, state) {
        // applet-dependent
		  }
	
		proto._jsSetScreenDimensions = function() {
				if (!this._appletPanel)return
				// strangely, if CTRL+/CTRL- are used repeatedly, then the
				// applet div can be not the same size as the canvas if there
				// is a border in place.
				var d = J2S._getElement(this, (this._is2D ? "canvas2d" : "canvas"));
				this._appletPanel.setScreenDimension(d.width, d.height);
		};

		proto._show = function(tf) {
			J2S.$setVisible(J2S.$(this,"appletdiv"), tf);
			if (tf && !this._isSwing) // SwingJS applets will handle their own repainting
				J2S._repaint(this, true);
		};

		proto._canScript = function(script) {return true};
		proto.equals = function(a) { return this == a };
		proto.clone = function() { return this };
		proto.hashCode = function() { return parseInt(this._uniqueId) };  


		proto._processGesture = function(touches, frameViewer) {
      (frameViewer || this._appletPanel).processTwoPointGesture(touches);
		}

		proto._processEvent = function(type, xym, ev, frameViewer) {
      (frameViewer || this._appletPanel).processMouseEvent(type,xym[0],xym[1],xym[2],System.currentTimeMillis(), ev);
		}

		proto._resize = function() {
			var s = "__resizeTimeout_" + this._id;
			// only at end
			if (J2S[s])
				clearTimeout(J2S[s]);
			var me = this;
			J2S[s] = setTimeout(function() {J2S._repaint(me, true);J2S[s]=null}, 100);
		}

		return proto;
	};

	J2S._repaint = function(applet, asNewThread) {
    // JmolObjectInterface 
		// asNewThread: true is from RepaintManager.repaintNow()
		// false is from Repaintmanager.requestRepaintAndWait()
		// called from apiPlatform Display.repaint()

		//alert("_repaint " + Clazz.getStackTrace())
		if (!applet || !applet._appletPanel)return;

		// asNewThread = false;
		var container = J2S.$(applet, "appletdiv");
		var w = Math.round(container.width());
		var h = Math.round(container.height());
		if (applet._is2D && (applet._canvas.width != w || applet._canvas.height != h)) {
			applet._newCanvas(true);
			applet._appletPanel.setDisplay(applet._canvas);
		}
		applet._appletPanel.setScreenDimension(w, h);
    var f = function(){
      if (applet._appletPanel.paint)
        applet._appletPanel.paint(null);
      else
        applet._appletPanel.update(null)
    };
		if (asNewThread) {
			(self.requestAnimationFrame || self.setTimeout)(f); // requestAnimationFrame or (MSIE 9) setTimeout
		} else {
      f();
		}
		// System.out.println(applet._appletPanel.getFullName())
	}

  /**
   * _loadImage is called for asynchronous image loading.   
   * If bytes are not null, they are from a ZIP file. They are processed sychronously
   * here using an image data URI. Can all browsers handle MB of data in data URI?
   *
   */        
	J2S._loadImage = function(platform, echoName, path, bytes, fOnload, image) {
    // JmolObjectInterface  
		var id = "echo_" + echoName + path + (bytes ? "_" + bytes.length : "");
		var canvas = J2S._getHiddenCanvas(platform.vwr.html5Applet, id, 0, 0, false, true);
//    System.out.println(["JSmol.js loadImage ",id,path,canvas,image])
    if (canvas == null) { 
  		if (image == null) {
  			image = new Image();
        if (bytes == null) {
          image.onload = function() {J2S._loadImage(platform, echoName, path, null, fOnload, image)};
    			image.src = path;
          return null;
        } else {
              System.out.println("Jsmol.js J2S._loadImage using data URI for " + id) 
        }
        image.src = (typeof bytes == "string" ? bytes : 
          "data:" + JU.Rdr.guessMimeTypeForBytes(bytes) + ";base64," + JU.Base64.getBase64(bytes));
      }
  		var width = image.width;
  		var height = image.height;
      if (echoName == "webgl") {
       // will be antialiased
       width /= 2;
       height /= 2; 
      } 
		  canvas = J2S._getHiddenCanvas(platform.vwr.html5Applet, id, width, height, true, false);
  		canvas.imageWidth = width;
  		canvas.imageHeight = height;
  		canvas.id = id;
  		canvas.image=image;
  		J2S._setCanvasImage(canvas, width, height);
		// return a null canvas and the error in path if there is a problem
    } else {
      System.out.println("J2S._loadImage reading cached image for " + id) 
    }
    return (bytes == null? fOnload(canvas,path) : canvas);
	};

  J2S._canvasCache = {};

	J2S._getHiddenCanvas = function(applet, id, width, height, forceNew, checkOnly) {
		id = applet._id + "_" + id;
    var d = J2S._canvasCache[id];
    if (checkOnly)
      return d; 
    if (forceNew || !d || d.width != width || d.height != height) {
      d = document.createElement( 'canvas' );
  			// for some reason both these need to be set, or maybe just d.width?
  		d.width = d.style.width = width;
  		d.height = d.style.height = height;
  		d.id = id;
      J2S._canvasCache[id] = d;
      //System.out.println("JSmol.js loadImage setting cache" + id + " to " + d)
    }
    
		return d;
   	}

	J2S._setCanvasImage = function(canvas, width, height) {
    // called from org.J2S.awtjs2d.Platform
		canvas.buf32 = null;
		canvas.width = width;
		canvas.height = height;
		canvas.getContext("2d").drawImage(canvas.image, 0, 0, canvas.image.width, canvas.image.height, 0, 0, width, height);
	};
  
  J2S._apply = function(f,a) {
    // JmolObjectInterface
    return f(a);
  }

J2S._setDraggable = function(tag, targetOrArray) {


 // draggable tag object; target is itself
 
    // J2S._setDraggable(tag)
    // J2S._setDraggable(tag, true)
    
 // draggable tag object that controls another target, 
 // either given as a DOM element or jQuery selector or function returning such
    
    // J2S._setDraggable(tag, target)
    // J2S._setDraggable(tag, fTarget)
    
 // draggable tag object simply loades/reports mouse position as 
 // fDown({x:x,y:y,dx:dx,dy:dy,ev:ev}) should fill x and y with starting points
 // fDrag(xy) and fUp(xy) will get {x:x,y:y,dx:dx,dy:dy,ev:ev} to use as desired 

    // J2S._setDraggable(tag, [fAll])
    // J2S._setDraggable(tag, [fDown, fDrag, fUp])

 // unbind tag
 
    // J2S._setDraggable(tag, false)
    
    
  // draggable frames by their titles.
  // activation of dragging with a mouse down action 
  // deactivates all other mouse operation in SwingJS
  // until the mouse is released.
  // uses jQuery outside events - v1.1 - 3/16/2010 (see j2sJQueryExt.js)


  // J2S._setDraggable(titlebar, frame.outerNode), for example, is issued in swingjs.plaf.JSFrameUI.js
  
	var dragBind = function(isBind) {
  
		$tag.unbind('mousemoveoutjsmol');
		$tag.unbind('touchmoveoutjsmol');
		$tag.unbind('mouseupoutjsmol');
		$tag.unbind('touchendoutjsmol');
		J2S._dmouseOwner = null;
    tag.isDragging = false;
    tag._isDragger = false;
		if (isBind) {
			$tag.bind('mousemoveoutjsmol touchmoveoutjsmol', function(ev) {
				drag(ev);
			});
			$tag.bind('mouseupoutjsmol touchendoutjsmol', function(ev) {
				up(ev);
			});
		}
	};  

	var $tag = $(tag);
  tag = $tag[0];
	if (tag._isDragger)
		return;

  var target, fDown, fDrag, fUp;
  if (targetOrArray === false) {
    dragBind(tag, false);
    return;
  }
  if (targetOrArray instanceof Array) { 
    // J2S._setDraggable(tag, [fAll])
    // J2S._setDraggable(tag, [fDown, fDrag, fUp])
    fDown = targetOrArray[0];
    fDrag = targetOrArray[1] || fDown;
    fUp = targetOrArray[2] || fDown;
  } else { 
    // J2S._setDraggable(tag)
    // J2S._setDraggable(tag, true)
    // J2S._setDraggable(tag, target)
    // J2S._setDraggable(tag, fTarget)
    target = (targetOrArray !== true && targetOrArray || tag);
    // allow for a function to return the target
    // this allows the target to be created after the call to J2S._setDraggable()
    if (!(typeof target == "function")) {
      var t = target;
      target = function(){return $(t).parent()}  
    }
  }

  tag._isDragger = true;

  var x, y, dx, dy, pageX0, pageY0, pageX, pageY;
  
  var down = function(ev) {
  	J2S._dmouseOwner = tag;
		tag.isDragging = true; // used by J2S mouse event business
		pageX = ev.pageX;
		pageY = ev.pageY;
    var xy = {x:0,y:0,dx:0,dy:0, ev:ev};
    if (fDown) {
      fDown(xy, 501);
    } else if (target) {
      var o = $(target()).position();
      xy = {x:o.left, y:o.top};
    }
    pageX0 = xy.x;
    pageY0 = xy.y;
		return false;
  };

	var drag = function(ev) {
  // we will move the frame's parent node and take the frame along with it
  	if (tag.isDragging && J2S._dmouseOwner == tag) {
			x = pageX0 + (dx = ev.pageX - pageX);
			y = pageY0 + (dy = ev.pageY - pageY);
      if (fDrag) {
        fDrag({x:x, y:y, dx:dx, dy:dy, ev:ev}, 506);
      } else if (target) {
  			$(target()).css({ top: y + 'px', left: x + 'px' })
      }
		}
	};
  
	var up = function(ev) {
	if (J2S._dmouseOwner == tag) {
			tag.isDragging = false;
  		J2S._dmouseOwner = null
      fUp && fUp({x:x,y:y,dx:dx,dy:dy,ev:ev}, 502);
			return false;
		} else {
    }
	};

	$tag.bind('mousedown touchstart', function(ev) {
    return down(ev);
	});
  
	$tag.bind('mousemove touchmove', function(ev) {
    return drag(ev);
	});
  
	$tag.bind('mouseup touchend', function(ev) {
		return up(ev);
	});

  dragBind(true);
  
}

J2S._setWindowZIndex = function(node, z) {
  // on frame show or mouse-down, create a stack of frames and sort by z-order
  if (!node) return 
  var zbase = J2S._z.rear + 2000;
  var a = [];
  var zmin = 1e10
  var zmax = -1e10
  var $windows = $(".swingjs-window");
  $windows.each(function(c,b){
  if (b != node)a.push([+b.style.zIndex,b]);});
  a.sort(function(a,b){return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0})
  var z0 = zbase;
  for (var i = 0; i < a.length; i++) {
    a[i][1].style.zIndex = zbase;
    zbase += 1000;
  }
  z = (node.style.zIndex = (z > 0 ? zbase : z0));
  if (J2S._checkLoading)
    System.out.println("setting z-index to " + z + " for " + node.id); 
  return z;
} 

J2S.say = function(msg) {
	alert(msg);
}
 
J2S.Swing = {
	// a static class for menus
	count:0,
	menuInitialized:0,
	menuCounter:0
};


J2S.showInfo = function(applet, tf) {
	applet._showInfo(tf);
}


})(J2S);

