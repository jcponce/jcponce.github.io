Clazz.declarePackage ("sun.util.resources");
Clazz.load (["java.util.ResourceBundle"], "sun.util.resources.LocaleData", ["java.lang.NullPointerException", "java.util.StringTokenizer", "java.util.Locale"], function () {
c$ = Clazz.declareType (sun.util.resources, "LocaleData");
c$.getAvailableLocales = Clazz.defineMethod (c$, "getAvailableLocales", 
function () {
return sun.util.resources.LocaleData.AvailableLocales.localeList.clone ();
});
c$.getCalendarData = Clazz.defineMethod (c$, "getCalendarData", 
function (locale) {
return sun.util.resources.LocaleData.getBundle ("sun.util.resources.CalendarData", locale);
}, "java.util.Locale");
c$.getDateFormatData = Clazz.defineMethod (c$, "getDateFormatData", 
function (locale) {
return sun.util.resources.LocaleData.getBundle ("sun.text.resources.FormatData", locale);
}, "java.util.Locale");
c$.getNumberFormatData = Clazz.defineMethod (c$, "getNumberFormatData", 
function (locale) {
return sun.util.resources.LocaleData.getBundle ("sun.text.resources.FormatData", locale);
}, "java.util.Locale");
c$.getBundle = Clazz.defineMethod (c$, "getBundle", 
 function (baseName, locale) {
return java.util.ResourceBundle.getBundle (baseName, locale, sun.util.resources.LocaleData.LocaleDataResourceBundleControl.getRBControlInstance ());
}, "~S,java.util.Locale");
c$.createLocaleList = Clazz.defineMethod (c$, "createLocaleList", 
 function () {
var supportedLocaleString = "en|";
if (supportedLocaleString.length == 0) {
return null;
}var barIndex = supportedLocaleString.indexOf ("|");
var localeStringTokenizer = null;
localeStringTokenizer =  new java.util.StringTokenizer (supportedLocaleString.substring (0, barIndex));
var locales =  new Array (localeStringTokenizer.countTokens ());
for (var i = 0; i < locales.length; i++) {
var currentToken = localeStringTokenizer.nextToken ();
var p2 = 0;
var p1 = currentToken.indexOf ('_');
var language = "";
var country = "";
var variant = "";
if (p1 == -1) {
language = currentToken;
} else {
language = currentToken.substring (0, p1);
p2 = currentToken.indexOf ('_', p1 + 1);
if (p2 == -1) {
country = currentToken.substring (p1 + 1);
} else {
country = currentToken.substring (p1 + 1, p2);
if (p2 < currentToken.length) {
variant = currentToken.substring (p2 + 1);
}}}locales[i] =  new java.util.Locale (language, country, variant);
}
return locales;
});
Clazz.pu$h(self.c$);
c$ = Clazz.declareType (sun.util.resources.LocaleData, "AvailableLocales");
c$.localeList = c$.prototype.localeList = sun.util.resources.LocaleData.createLocaleList ();
c$ = Clazz.p0p ();
Clazz.pu$h(self.c$);
c$ = Clazz.declareType (sun.util.resources.LocaleData, "LocaleDataResourceBundleControl", java.util.ResourceBundle.Control);
c$.getRBControlInstance = Clazz.defineMethod (c$, "getRBControlInstance", 
function () {
return sun.util.resources.LocaleData.LocaleDataResourceBundleControl.rbControlInstance;
});
Clazz.overrideMethod (c$, "getFormats", 
function (a) {
if (a == null) {
throw  new NullPointerException ();
}return (a.indexOf ("sun.util.resources.Calendar") >= 0 ? java.util.ResourceBundle.Control.FORMAT_PROPERTIES : java.util.ResourceBundle.Control.FORMAT_CLASS);
}, "~S");
Clazz.defineMethod (c$, "getCandidateLocales", 
function (a, b) {
var c = Clazz.superCall (this, sun.util.resources.LocaleData.LocaleDataResourceBundleControl, "getCandidateLocales", [a, b]);
var d = " en ";
if (d.length == 0) {
return c;
}for (var e = c.iterator (); e.hasNext (); ) {
var f = e.next ().toString ();
if (f.length != 0 && d.indexOf (" " + f + " ") == -1) {
e.remove ();
}}
return c;
}, "~S,java.util.Locale");
Clazz.overrideMethod (c$, "getFallbackLocale", 
function (a, b) {
if (a == null || b == null) {
throw  new NullPointerException ();
}return null;
}, "~S,java.util.Locale");
c$.rbControlInstance = c$.prototype.rbControlInstance =  new sun.util.resources.LocaleData.LocaleDataResourceBundleControl ();
c$ = Clazz.p0p ();
});
