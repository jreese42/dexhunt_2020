function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,t,r){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||r))throw n.message+=" on line "+t,n;try{r=r||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,t)}var a=3,i=r.split("\n"),o=Math.max(t-a,0),h=Math.min(i.length,t+a),a=i.slice(o,h).map(function(n,e){var r=e+o+1;return(r==t?"  > ":"    ")+r+"| "+n}).join("\n");n.path=e;try{n.message=(e||"Pug")+":"+t+"\n"+a+"\n\n"+n.message}catch(n){}throw n}function render_gameTurn(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;
    var locals_for_with = (locals || {});
    
    (function (playerInput, resultOutput) {
      ;pug_debug_line = 1;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cdiv class=\"turn\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cspan class=\"vorplePrompt\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "&gt; \u003C\u002Fspan\u003E";
;pug_debug_line = 3;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cspan class=\"previousCommand\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = playerInput) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 4;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cdiv class=\"turnContent\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cdiv class=\"main\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = resultOutput) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 7;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cbr\u002F\u003E";
;pug_debug_line = 8;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003Cbr\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 10;pug_debug_filename = "views\u002Fclient\u002Fui_gameTurn.pug";
pug_html = pug_html + "\u003C!--Todo: transient resultOutput\u002Ferrors--\u003E";
    }.call(this, "playerInput" in locals_for_with ?
        locals_for_with.playerInput :
        typeof playerInput !== 'undefined' ? playerInput : undefined, "resultOutput" in locals_for_with ?
        locals_for_with.resultOutput :
        typeof resultOutput !== 'undefined' ? resultOutput : undefined));
    ;} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}