Clazz.declarePackage ("sun.text.resources");
Clazz.load (["java.util.ListResourceBundle"], "sun.text.resources.FormatData_en", null, function () {
c$ = Clazz.declareType (sun.text.resources, "FormatData_en", java.util.ListResourceBundle);
Clazz.overrideMethod (c$, "getContents", 
function () {
return [["NumberPatterns", ["#,##0.###;-#,##0.###", "\u00A4#,##0.00;-\u00A4#,##0.00", "#,##0%"]], ["DateTimePatternChars", "GyMdkHmsSEDFwWahKzZ"]];
});
});
