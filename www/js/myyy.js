var cc1 = 0;
var heightC = 0;
var widthC = 0;
var hjj;
var hjjO = 0;
var zapross = 0, getPagee = 0;
var queryS = '';
var woodbgPos, gkPagePos = 0;
var searchV = false;



/*
 * Lazy Load - jQuery plugin for lazy loading images
 * * Copyright (c) 2007-2013 Mika Tuupola
 * * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 * * Version:  1.9.3
 * */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null,
            placeholder     : "/images/site/loaderR.gif"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);
$($self).removeClass('loadd');
$self.attr("style", $self.attr("stylepre"));
                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                    
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

/*
	* WOW - v1.0.1 - 2014-08-15
	* Copyright (c) 2014 Matthieu Aussaguel; Licensed MIT 
*/
/*
(function($){

(function(){var a,b,c,d=function(a,b){return function(){return a.apply(b,arguments)}},e=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};b=function(){function a(){}return a.prototype.extend=function(a,b){var c,d;for(c in b)d=b[c],null==a[c]&&(a[c]=d);return a},a.prototype.isMobile=function(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)},a}(),c=this.WeakMap||this.MozWeakMap||(c=function(){function a(){this.keys=[],this.values=[]}return a.prototype.get=function(a){var b,c,d,e,f;for(f=this.keys,b=d=0,e=f.length;e>d;b=++d)if(c=f[b],c===a)return this.values[b]},a.prototype.set=function(a,b){var c,d,e,f,g;for(g=this.keys,c=e=0,f=g.length;f>e;c=++e)if(d=g[c],d===a)return void(this.values[c]=b);return this.keys.push(a),this.values.push(b)},a}()),a=this.MutationObserver||this.WebkitMutationObserver||this.MozMutationObserver||(a=function(){function a(){console.warn("MutationObserver is not supported by your browser."),console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")}return a.notSupported=!0,a.prototype.observe=function(){},a}()),this.WOW=function(){function f(a){null==a&&(a={}),this.scrollCallback=d(this.scrollCallback,this),this.scrollHandler=d(this.scrollHandler,this),this.start=d(this.start,this),this.scrolled=!0,this.config=this.util().extend(a,this.defaults),this.animationNameCache=new c}return f.prototype.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0},f.prototype.init=function(){var a;return this.element=window.document.documentElement,"interactive"===(a=document.readyState)||"complete"===a?this.start():document.addEventListener("DOMContentLoaded",this.start),this.finished=[]},f.prototype.start=function(){var b,c,d,e;if(this.stopped=!1,this.boxes=function(){var a,c,d,e;for(d=this.element.querySelectorAll("."+this.config.boxClass),e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.all=function(){var a,c,d,e;for(d=this.boxes,e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.boxes.length)if(this.disabled())this.resetStyle();else{for(e=this.boxes,c=0,d=e.length;d>c;c++)b=e[c],this.applyStyle(b,!0);window.addEventListener("scroll",this.scrollHandler,!1),window.addEventListener("resize",this.scrollHandler,!1),this.interval=setInterval(this.scrollCallback,50)}return this.config.live?new a(function(a){return function(b){var c,d,e,f,g;for(g=[],e=0,f=b.length;f>e;e++)d=b[e],g.push(function(){var a,b,e,f;for(e=d.addedNodes||[],f=[],a=0,b=e.length;b>a;a++)c=e[a],f.push(this.doSync(c));return f}.call(a));return g}}(this)).observe(document.body,{childList:!0,subtree:!0}):void 0},f.prototype.stop=function(){return this.stopped=!0,window.removeEventListener("scroll",this.scrollHandler,!1),window.removeEventListener("resize",this.scrollHandler,!1),null!=this.interval?clearInterval(this.interval):void 0},f.prototype.sync=function(){return a.notSupported?this.doSync(this.element):void 0},f.prototype.doSync=function(a){var b,c,d,f,g;if(!this.stopped){if(null==a&&(a=this.element),1!==a.nodeType)return;for(a=a.parentNode||a,f=a.querySelectorAll("."+this.config.boxClass),g=[],c=0,d=f.length;d>c;c++)b=f[c],e.call(this.all,b)<0?(this.applyStyle(b,!0),this.boxes.push(b),this.all.push(b),g.push(this.scrolled=!0)):g.push(void 0);return g}},f.prototype.show=function(a){return this.applyStyle(a),a.className=""+a.className+" "+this.config.animateClass},f.prototype.applyStyle=function(a,b){var c,d,e;return d=a.getAttribute("data-wow-duration"),c=a.getAttribute("data-wow-delay"),e=a.getAttribute("data-wow-iteration"),this.animate(function(f){return function(){return f.customStyle(a,b,d,c,e)}}(this))},f.prototype.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),f.prototype.resetStyle=function(){var a,b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.setAttribute("style","visibility: visible;"));return e},f.prototype.customStyle=function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a},f.prototype.vendors=["moz","webkit"],f.prototype.vendorSet=function(a,b){var c,d,e,f;f=[];for(c in b)d=b[c],a[""+c]=d,f.push(function(){var b,f,g,h;for(g=this.vendors,h=[],b=0,f=g.length;f>b;b++)e=g[b],h.push(a[""+e+c.charAt(0).toUpperCase()+c.substr(1)]=d);return h}.call(this));return f},f.prototype.vendorCSS=function(a,b){var c,d,e,f,g,h;for(d=window.getComputedStyle(a),c=d.getPropertyCSSValue(b),h=this.vendors,f=0,g=h.length;g>f;f++)e=h[f],c=c||d.getPropertyCSSValue("-"+e+"-"+b);return c},f.prototype.animationName=function(a){var b;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=window.getComputedStyle(a).getPropertyValue("animation-name")}return"none"===b?"":b},f.prototype.cacheAnimationName=function(a){return this.animationNameCache.set(a,this.animationName(a))},f.prototype.cachedAnimationName=function(a){return this.animationNameCache.get(a)},f.prototype.scrollHandler=function(){return this.scrolled=!0},f.prototype.scrollCallback=function(){var a;return!this.scrolled||(this.scrolled=!1,this.boxes=function(){var b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],a&&(this.isVisible(a)?this.show(a):e.push(a));return e}.call(this),this.boxes.length||this.config.live)?void 0:this.stop()},f.prototype.offsetTop=function(a){for(var b;void 0===a.offsetTop;)a=a.parentNode;for(b=a.offsetTop;a=a.offsetParent;)b+=a.offsetTop;return b},f.prototype.isVisible=function(a){var b,c,d,e,f;return c=a.getAttribute("data-wow-offset")||this.config.offset,f=window.pageYOffset,e=f+Math.min(this.element.clientHeight,innerHeight)-c,d=this.offsetTop(a),b=d+a.clientHeight,e>=d&&b>=f},f.prototype.util=function(){return null!=this._util?this._util:this._util=new b},f.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent)},f}()}).call(this);

}(jQuery));


	*jQuery OwlCarousel v1.27
	*Copyright (c) 2013 Bartosz Wojciechowski
	*http://www.owlgraphic.com/owlcarousel
	*Licensed under MIT
*/
/*
(function($){

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7(F 3v.2K!=="9"){3v.2K=9(e){9 t(){}t.5C=e;q 5B t}}(9(e,t,n,r){b i={1K:9(t,n){b r=c;r.6=e.3F({},e.3g.28.6,t);r.27=t;b i=n;b s=e(n);r.$k=s;r.3G()},3G:9(){b t=c;7(F t.6.2Y==="9"){t.6.2Y.U(c,[t.$k])}7(F t.6.38==="3a"){b n=t.6.38;9 r(e){7(F t.6.3d==="9"){t.6.3d.U(c,[e])}p{b n="";1Z(b r 3x e["h"]){n+=e["h"][r]["1W"]}t.$k.29(n)}t.2R()}e.5w(n,r)}p{t.2R()}},2R:9(e){b t=c;t.$k.A({23:0});t.2n=t.6.v;t.3M();t.5p=0;t.21;t.1L()},1L:9(){b e=c;7(e.$k.1Q().14===0){q d}e.1M();e.3T();e.$V=e.$k.1Q();e.J=e.$V.14;e.3Z();e.$L=e.$k.Z(".h-1W");e.$H=e.$k.Z(".h-1g");e.3e="R";e.1i=0;e.m=0;e.40();e.42()},42:9(){b e=c;e.2H();e.2I();e.4c();e.2L();e.4e();e.4f();e.22();e.4l();7(e.6.2j!==d){e.4o(e.6.2j)}7(e.6.N===j){e.6.N=4I}e.1b();e.$k.Z(".h-1g").A("4D","4E");7(!e.$k.2x(":32")){e.37()}p{e.$k.A("23",1)}e.5j=d;e.2l();7(F e.6.3b==="9"){e.6.3b.U(c,[e.$k])}},2l:9(){b e=c;7(e.6.1J===j){e.1J()}7(e.6.1q===j){e.1q()}7(e.6.2g===j){e.2g()}7(F e.6.3i==="9"){e.6.3i.U(c,[e.$k])}},3j:9(){b e=c;7(F e.6.3l==="9"){e.6.3l.U(c,[e.$k])}e.37();e.2H();e.2I();e.4C();e.2L();e.2l();7(F e.6.3o==="9"){e.6.3o.U(c,[e.$k])}},4B:9(e){b t=c;19(9(){t.3j()},0)},37:9(){b e=c;7(e.$k.2x(":32")===d){e.$k.A({23:0});1a(e.1u);1a(e.21)}p{q d}e.21=4z(9(){7(e.$k.2x(":32")){e.4B();e.$k.4y({23:1},2E);1a(e.21)}},4J)},3Z:9(){b e=c;e.$V.4U(\'<M K="h-1g">\').4u(\'<M K="h-1W"></M>\');e.$k.Z(".h-1g").4u(\'<M K="h-1g-4t">\');e.1D=e.$k.Z(".h-1g-4t");e.$k.A("4D","4E")},1M:9(){b e=c;b t=e.$k.1H(e.6.1M);b n=e.$k.1H(e.6.24);e.$k.w("h-4s",e.$k.2c("2d")).w("h-4r",e.$k.2c("K"));7(!t){e.$k.I(e.6.1M)}7(!n){e.$k.I(e.6.24)}},2H:9(){b t=c;7(t.6.2V===d){q d}7(t.6.4q===j){t.6.v=t.2n=1;t.6.1v=d;t.6.1I=d;t.6.1X=d;t.6.1A=d;t.6.1E=d;q d}b n=e(t.6.4p).1h();7(n>(t.6.1v[0]||t.2n)){t.6.v=t.2n}7(n<=t.6.1v[0]&&t.6.1v!==d){t.6.v=t.6.1v[1]}7(n<=t.6.1I[0]&&t.6.1I!==d){t.6.v=t.6.1I[1]}7(n<=t.6.1X[0]&&t.6.1X!==d){t.6.v=t.6.1X[1]}7(n<=t.6.1A[0]&&t.6.1A!==d){t.6.v=t.6.1A[1]}7(n<=t.6.1E[0]&&t.6.1E!==d){t.6.v=t.6.1E[1]}7(t.6.v>t.J){t.6.v=t.J}},4e:9(){b n=c,r;7(n.6.2V!==j){q d}b i=e(t).1h();n.33=9(){7(e(t).1h()!==i){7(n.6.N!==d){1a(n.1u)}4V(r);r=19(9(){i=e(t).1h();n.3j()},n.6.4n)}};e(t).4m(n.33)},4C:9(){b e=c;7(e.B.1j===j){7(e.D[e.m]>e.2a){e.1k(e.D[e.m])}p{e.1k(0);e.m=0}}p{7(e.D[e.m]>e.2a){e.16(e.D[e.m])}p{e.16(0);e.m=0}}7(e.6.N!==d){e.3f()}},4i:9(){b t=c;b n=0;b r=t.J-t.6.v;t.$L.2h(9(i){b s=e(c);s.A({1h:t.P}).w("h-1W",3k(i));7(i%t.6.v===0||i===r){7(!(i>r)){n+=1}}s.w("h-2y",n)})},4h:9(){b e=c;b t=0;b t=e.$L.14*e.P;e.$H.A({1h:t*2,X:0});e.4i()},2I:9(){b e=c;e.4g();e.4h();e.4b();e.3t()},4g:9(){b e=c;e.P=1P.57(e.$k.1h()/e.6.v)},3t:9(){b e=c;e.E=e.J-e.6.v;b t=e.J*e.P-e.6.v*e.P;t=t*-1;e.2a=t;q t},47:9(){q 0},4b:9(){b e=c;e.D=[0];b t=0;1Z(b n=0;n<e.J;n++){t+=e.P;e.D.58(-t)}},4c:9(){b t=c;7(t.6.25===j||t.6.1t===j){t.G=e(\'<M K="h-59"/>\').5a("5b",!t.B.Y).5d(t.$k)}7(t.6.1t===j){t.3V()}7(t.6.25===j){t.3R()}},3R:9(){b t=c;b n=e(\'<M K="h-5l"/>\');t.G.1e(n);t.1s=e("<M/>",{"K":"h-1o",29:t.6.2P[0]||""});t.1z=e("<M/>",{"K":"h-R",29:t.6.2P[1]||""});n.1e(t.1s).1e(t.1z);n.z("2s.G 2u.G",\'M[K^="h"]\',9(n){n.1r();7(e(c).1H("h-R")){t.R()}p{t.1o()}})},3V:9(){b t=c;t.1p=e(\'<M K="h-1t"/>\');t.G.1e(t.1p);t.1p.z("2s.G 2u.G",".h-1n",9(n){n.1r();7(3k(e(c).w("h-1n"))!==t.m){t.1m(3k(e(c).w("h-1n")),j)}})},3J:9(){b t=c;7(t.6.1t===d){q d}t.1p.29("");b n=0;b r=t.J-t.J%t.6.v;1Z(b i=0;i<t.J;i++){7(i%t.6.v===0){n+=1;7(r===i){b s=t.J-t.6.v}b o=e("<M/>",{"K":"h-1n"});b u=e("<3H></3H>",{5x:t.6.31===j?n:"","K":t.6.31===j?"h-5y":""});o.1e(u);o.w("h-1n",r===i?s:i);o.w("h-2y",n);t.1p.1e(o)}}t.2O()},2O:9(){b t=c;7(t.6.1t===d){q d}t.1p.Z(".h-1n").2h(9(n,r){7(e(c).w("h-2y")===e(t.$L[t.m]).w("h-2y")){t.1p.Z(".h-1n").S("2e");e(c).I("2e")}})},36:9(){b e=c;7(e.6.25===d){q d}7(e.6.2f===d){7(e.m===0&&e.E===0){e.1s.I("15");e.1z.I("15")}p 7(e.m===0&&e.E!==0){e.1s.I("15");e.1z.S("15")}p 7(e.m===e.E){e.1s.S("15");e.1z.I("15")}p 7(e.m!==0&&e.m!==e.E){e.1s.S("15");e.1z.S("15")}}},2L:9(){b e=c;e.3J();e.36();7(e.G){7(e.6.v===e.J){e.G.3E()}p{e.G.3B()}}},5A:9(){b e=c;7(e.G){e.G.3c()}},R:9(e){b t=c;7(t.1S){q d}t.1T=t.m;t.m+=t.6.1U===j?t.6.v:1;7(t.m>t.E+(t.6.1U==j?t.6.v-1:0)){7(t.6.2f===j){t.m=0;e="2m"}p{t.m=t.E;q d}}t.1m(t.m,e)},1o:9(e){b t=c;7(t.1S){q d}t.1T=t.m;7(t.6.1U===j&&t.m>0&&t.m<t.6.v){t.m=0}p{t.m-=t.6.1U===j?t.6.v:1}7(t.m<0){7(t.6.2f===j){t.m=t.E;e="2m"}p{t.m=0;q d}}t.1m(t.m,e)},1m:9(e,t,n){b r=c;7(r.1S){q d}r.3h();7(F r.6.1V==="9"){r.6.1V.U(c,[r.$k])}7(e>=r.E){e=r.E}p 7(e<=0){e=0}r.m=r.h.m=e;7(r.6.2j!==d&&n!=="4w"&&r.6.v===1&&r.B.1j===j){r.1x(0);7(r.B.1j===j){r.1k(r.D[e])}p{r.16(r.D[e],1)}r.3z();r.2q();q d}b i=r.D[e];7(r.B.1j===j){r.1Y=d;7(t===j){r.1x("1y");19(9(){r.1Y=j},r.6.1y)}p 7(t==="2m"){r.1x(r.6.2t);19(9(){r.1Y=j},r.6.2t)}p{r.1x("1f");19(9(){r.1Y=j},r.6.1f)}r.1k(i)}p{7(t===j){r.16(i,r.6.1y)}p 7(t==="2m"){r.16(i,r.6.2t)}p{r.16(i,r.6.1f)}}r.2q()},3h:9(){b e=c;e.1i=e.h.1i=e.1T===r?e.m:e.1T;e.1T=r},3r:9(e){b t=c;t.3h();7(F t.6.1V==="9"){t.6.1V.U(c,[t.$k])}7(e>=t.E||e===-1){e=t.E}p 7(e<=0){e=0}t.1x(0);7(t.B.1j===j){t.1k(t.D[e])}p{t.16(t.D[e],1)}t.m=t.h.m=e;t.2q()},2q:9(){b e=c;e.2O();e.36();e.2l();7(F e.6.3s==="9"){e.6.3s.U(c,[e.$k])}7(e.6.N!==d){e.3f()}},W:9(){b e=c;e.3u="W";1a(e.1u)},3f:9(){b e=c;7(e.3u!=="W"){e.1b()}},1b:9(){b e=c;e.3u="1b";7(e.6.N===d){q d}1a(e.1u);e.1u=4z(9(){e.R(j)},e.6.N)},1x:9(e){b t=c;7(e==="1f"){t.$H.A(t.2w(t.6.1f))}p 7(e==="1y"){t.$H.A(t.2w(t.6.1y))}p 7(F e!=="3a"){t.$H.A(t.2w(e))}},2w:9(e){b t=c;q{"-1G-1d":"2p "+e+"1w 2i","-1R-1d":"2p "+e+"1w 2i","-o-1d":"2p "+e+"1w 2i",1d:"2p "+e+"1w 2i"}},3C:9(){q{"-1G-1d":"","-1R-1d":"","-o-1d":"",1d:""}},3D:9(e){q{"-1G-O":"1l("+e+"T, C, C)","-1R-O":"1l("+e+"T, C, C)","-o-O":"1l("+e+"T, C, C)","-1w-O":"1l("+e+"T, C, C)",O:"1l("+e+"T, C,C)"}},1k:9(e){b t=c;t.$H.A(t.3D(e))},3I:9(e){b t=c;t.$H.A({X:e})},16:9(e,t){b n=c;n.26=d;n.$H.W(j,j).4y({X:e},{5r:t||n.6.1f,3L:9(){n.26=j}})},3M:9(){b e=c;b r="1l(C, C, C)",i=n.5q("M");i.2d.3N="  -1R-O:"+r+"; -1w-O:"+r+"; -o-O:"+r+"; -1G-O:"+r+"; O:"+r;b s=/1l\\(C, C, C\\)/g,o=i.2d.3N.5n(s),u=o!==18&&o.14===1;b a="4F"3x t||5h.5e;e.B={1j:u,Y:a}},4f:9(){b e=c;7(e.6.1C!==d||e.6.1B!==d){e.3X();e.3Y()}},3T:9(){b e=c;b t=["s","e","x"];e.13={};7(e.6.1C===j&&e.6.1B===j){t=["41.h 2b.h","2A.h 44.h","2s.h 45.h 2u.h"]}p 7(e.6.1C===d&&e.6.1B===j){t=["41.h","2A.h","2s.h 45.h"]}p 7(e.6.1C===j&&e.6.1B===d){t=["2b.h","44.h","2u.h"]}e.13["46"]=t[0];e.13["2z"]=t[1];e.13["3w"]=t[2]},3Y:9(){b t=c;t.$k.z("55.h",9(e){e.1r()});t.$k.z("2b.4a",9(t){q e(t.1c).2x("54, 52, 51, 4Y")})},3X:9(){9 o(e){7(e.3p){q{x:e.3p[0].3m,y:e.3p[0].4j}}p{7(e.3m!==r){q{x:e.3m,y:e.4j}}p{q{x:e.4X,y:e.4W}}}}9 u(t){7(t==="z"){e(n).z(i.13["2z"],f);e(n).z(i.13["3w"],l)}p 7(t==="Q"){e(n).Q(i.13["2z"]);e(n).Q(i.13["3w"])}}9 a(n){b n=n.35||n||t.34;7(i.26===d&&!i.6.30){q d}7(i.1Y===d&&!i.6.30){q d}7(i.6.N!==d){1a(i.1u)}7(i.B.Y!==j&&!i.$H.1H("2W")){i.$H.I("2W")}i.11=0;i.12=0;e(c).A(i.3C());b r=e(c).2k();s.2J=r.X;s.2G=o(n).x-r.X;s.2F=o(n).y-r.4H;u("z");s.2o=d;s.2C=n.1c||n.4A}9 f(r){b r=r.35||r||t.34;i.11=o(r).x-s.2G;i.3q=o(r).y-s.2F;i.12=i.11-s.2J;7(F i.6.3n==="9"&&s.39!==j&&i.12!==0){s.39=j;i.6.3n.U(c)}7(i.12>8||i.12<-8&&i.B.Y===j){r.1r?r.1r():r.4G=d;s.2o=j}7((i.3q>10||i.3q<-10)&&s.2o===d){e(n).Q("2A.h")}b u=9(){q i.12/5};b a=9(){q i.2a+i.12/5};i.11=1P.3t(1P.47(i.11,u()),a());7(i.B.1j===j){i.1k(i.11)}p{i.3I(i.11)}}9 l(n){b n=n.35||n||t.34;n.1c=n.1c||n.4A;s.39=d;7(i.B.Y!==j){i.$H.S("2W")}7(i.12!==0){b r=i.4x();i.1m(r,d,"4w");7(s.2C===n.1c&&i.B.Y!==j){e(n.1c).z("2X.3y",9(t){t.4K();t.4L();t.1r();e(n.1c).Q("2X.3y")});b o=e.4M(n.1c,"4N")["2X"];b a=o.4O();o.4P(0,0,a)}}u("Q")}b i=c;b s={2G:0,2F:0,4Q:0,2J:0,2k:18,4R:18,4S:18,2o:18,4T:18,2C:18};i.26=j;i.$k.z(i.13["46"],".h-1g",a)},4x:9(){b e=c,t;b t=e.4v();7(t>e.E){e.m=e.E;t=e.E}p 7(e.11>=0){t=0;e.m=0}q t},4v:9(){b t=c;b n=t.D;b r=t.11;b i=18;e.2h(n,9(e,s){7(r-t.P/20>n[e+1]&&r-t.P/20<s&&t.2Q()==="X"){i=s;t.m=e}p 7(r+t.P/20<s&&r+t.P/20>n[e+1]&&t.2Q()==="4k"){i=n[e+1];t.m=e+1}});q t.m},2Q:9(){b e=c,t;7(e.12<0){t="4k";e.3e="R"}p{t="X";e.3e="1o"}q t},40:9(){b e=c;e.$k.z("h.R",9(){e.R()});e.$k.z("h.1o",9(){e.1o()});e.$k.z("h.1b",9(t,n){e.6.N=n;e.1b();e.2N="1b"});e.$k.z("h.W",9(){e.W();e.2N="W"});e.$k.z("h.1m",9(t,n){e.1m(n)});e.$k.z("h.3r",9(t,n){e.3r(n)})},22:9(){b e=c;7(e.6.22===j&&e.B.Y!==j&&e.6.N!==d){e.$k.z("4Z",9(){e.W()});e.$k.z("50",9(){7(e.2N!=="W"){e.1b()}})}},1J:9(){b t=c;7(t.6.1J===d){q d}1Z(b n=0;n<t.J;n++){b i=e(t.$L[n]);7(i.w("h-17")==="17"){4d}b s=i.w("h-1W"),o=i.Z(".53"),u;7(F o.w("2r")!=="3a"){i.w("h-17","17");4d}7(i.w("h-17")===r){o.3E();i.I("49").w("h-17","56")}7(t.6.48===j){u=s>=t.m}p{u=j}7(u&&s<t.m+t.6.v&&o.14){t.43(i,o)}}},43:9(e,t){9 i(){r+=1;7(n.2D(t.2B(0))){s()}p 7(r<=2v){19(i,2v)}p{s()}}9 s(){e.w("h-17","17").S("49");t.5c("w-2r");n.6.3W==="3U"?t.5f(5g):t.3B()}b n=c,r=0;t[0].2r=t.w("2r");i()},1q:9(){9 s(){i+=1;7(t.2D(n.2B(0))){o()}p 7(i<=2v){19(s,2v)}p{t.1D.A("2S","")}}9 o(){b n=e(t.$L[t.m]).2S();t.1D.A("2S",n+"T");7(!t.1D.1H("1q")){19(9(){t.1D.I("1q")},0)}}b t=c;b n=e(t.$L[t.m]).Z("5i");7(n.2B(0)!==r){b i=0;s()}p{o()}},2D:9(e){7(!e.3L){q d}7(F e.3S!=="5k"&&e.3S==0){q d}q j},2g:9(){b t=c;t.$L.S("2e");1Z(b n=t.m;n<t.m+t.6.v;n++){e(t.$L[n]).I("2e")}},4o:9(e){b t=c;t.3Q="h-"+e+"-5m";t.3P="h-"+e+"-3x"},3z:9(){9 u(e,t){q{2k:"5o",X:e+"T"}}b e=c;e.1S=j;b t=e.3Q,n=e.3P,r=e.$L.1O(e.m),i=e.$L.1O(e.1i),s=1P.3O(e.D[e.m])+e.D[e.1i],o=1P.3O(e.D[e.m])+e.P/2;e.$H.I("h-1F").A({"-1G-O-1F":o+"T","-1R-3K-1F":o+"T","3K-1F":o+"T"});b a="5s 5t 5u 5v";i.A(u(s,10)).I(t).z(a,9(){e.2T=j;i.Q(a);e.2U(i,t)});r.I(n).z(a,9(){e.2Z=j;r.Q(a);e.2U(r,n)})},2U:9(e,t){b n=c;e.A({2k:"",X:""}).S(t);7(n.2T&&n.2Z){n.$H.S("h-1F");n.2T=d;n.2Z=d;n.1S=d}},4l:9(){b e=c;e.h={27:e.27,5z:e.$k,V:e.$V,L:e.$L,m:e.m,1i:e.1i,Y:e.B.Y,B:e.B}},3A:9(){b r=c;r.$k.Q(".h h 2b.4a");e(n).Q(".h h");e(t).Q("4m",r.33)},1N:9(){b e=c;7(e.$k.1Q().14!==0){e.$H.2M();e.$V.2M().2M();7(e.G){e.G.3c()}}e.3A();e.$k.2c("2d",e.$k.w("h-4s")||"").2c("K",e.$k.w("h-4r"))},5D:9(){b e=c;e.W();1a(e.21);e.1N();e.$k.5E()},5F:9(t){b n=c;b r=e.3F({},n.27,t);n.1N();n.1K(r,n.$k)},5G:9(e,t){b n=c,i;7(!e){q d}7(n.$k.1Q().14===0){n.$k.1e(e);n.1L();q d}n.1N();7(t===r||t===-1){i=-1}p{i=t}7(i>=n.$V.14||i===-1){n.$V.1O(-1).5H(e)}p{n.$V.1O(i).5I(e)}n.1L()},5J:9(e){b t=c,n;7(t.$k.1Q().14===0){q d}7(e===r||e===-1){n=-1}p{n=e}t.1N();t.$V.1O(n).3c();t.1L()}};e.3g.28=9(t){q c.2h(9(){7(e(c).w("h-1K")===j){q d}e(c).w("h-1K",j);b n=3v.2K(i);n.1K(t,c);e.w(c,"28",n)})};e.3g.28.6={v:5,1v:[5K,4],1I:[5L,3],1X:[5M,2],1A:d,1E:[5N,1],4q:d,1f:2E,1y:5O,2t:5P,N:d,22:d,25:d,2P:["1o","R"],2f:j,1U:d,1t:j,31:d,2V:j,4n:2E,4p:t,1M:"h-5Q",24:"h-24",1J:d,48:j,3W:"3U",1q:d,38:d,3d:d,30:j,1C:j,1B:j,2g:d,2j:d,3l:d,3o:d,2Y:d,3b:d,1V:d,3s:d,3i:d,3n:d}})(5R,5S,5T)',62,366,'||||||options|if||function||var|this|false||||owl||true|elem||currentItem|||else|return|||||items|data|||on|css|browser|0px|positionsInArray|maximumItem|typeof|owlControls|owlWrapper|addClass|itemsAmount|class|owlItems|div|autoPlay|transform|itemWidth|off|next|removeClass|px|apply|userItems|stop|left|isTouch|find||newPosX|newRelativeX|ev_types|length|disabled|css2slide|loaded|null|setTimeout|clearInterval|play|target|transition|append|slideSpeed|wrapper|width|prevItem|support3d|transition3d|translate3d|goTo|page|prev|paginationWrapper|autoHeight|preventDefault|buttonPrev|pagination|autoPlayInterval|itemsDesktop|ms|swapSpeed|paginationSpeed|buttonNext|itemsTabletSmall|touchDrag|mouseDrag|wrapperOuter|itemsMobile|origin|webkit|hasClass|itemsDesktopSmall|lazyLoad|init|setVars|baseClass|unWrap|eq|Math|children|moz|isTransition|storePrevItem|scrollPerPage|beforeMove|item|itemsTablet|isCss3Finish|for||checkVisible|stopOnHover|opacity|theme|navigation|isCssFinish|userOptions|owlCarousel|html|maximumPixels|mousedown|attr|style|active|rewindNav|addClassActive|each|ease|transitionStyle|position|eachMoveUpdate|rewind|orignalItems|sliding|all|afterGo|src|touchend|rewindSpeed|mouseup|100|addCssSpeed|is|roundPages|move|touchmove|get|targetElement|completeImg|200|offsetY|offsetX|updateItems|calculateAll|relativePos|create|updateControls|unwrap|hoverStatus|checkPagination|navigationText|moveDirection|logIn|height|endPrev|clearTransStyle|responsive|grabbing|click|beforeInit|endCurrent|dragBeforeAnimFinish|paginationNumbers|visible|resizer|event|originalEvent|checkNavigation|watchVisibility|jsonPath|dragging|string|afterInit|remove|jsonSuccess|playDirection|checkAp|fn|getPrevItem|afterAction|updateVars|Number|beforeUpdate|pageX|startDragging|afterUpdate|touches|newPosY|jumpTo|afterMove|max|apStatus|Object|end|in|disable|singleItemTransition|clearEvents|show|removeTransition|doTranslate|hide|extend|loadContent|span|css2move|updatePagination|perspective|complete|checkBrowser|cssText|abs|inClass|outClass|buildButtons|naturalWidth|eventTypes|fade|buildPagination|lazyEffect|gestures|disabledEvents|wrapItems|customEvents|touchstart|onStartup|lazyPreload|mousemove|touchcancel|start|min|lazyFollow|loading|disableTextSelect|loops|buildControls|continue|response|moveEvents|calculateWidth|appendWrapperSizes|appendItemsSizes|pageY|right|owlStatus|resize|responsiveRefreshRate|transitionTypes|responsiveBaseWidth|singleItem|originalClasses|originalStyles|outer|wrap|improveClosest|drag|getNewPosition|animate|setInterval|srcElement|reload|updatePosition|display|block|ontouchstart|returnValue|top|5e3|500|stopImmediatePropagation|stopPropagation|_data|events|pop|splice|baseElWidth|minSwipe|maxSwipe|dargging|wrapAll|clearTimeout|clientY|clientX|option|mouseover|mouseout|select|textarea|lazyOwl|input|dragstart|checked|round|push|controls|toggleClass|clickable|removeAttr|appendTo|msMaxTouchPoints|fadeIn|400|navigator|img|onstartup|undefined|buttons|out|match|relative|wrapperWidth|createElement|duration|webkitAnimationEnd|oAnimationEnd|MSAnimationEnd|animationend|getJSON|text|numbers|baseElement|destroyControls|new|prototype|destroy|removeData|reinit|addItem|after|before|removeItem|1199|979|768|479|800|1e3|carousel|jQuery|window|document'.split('|'),0,{}))

}(jQuery));
*/


/*
	*@author       Constantin Saguin - @brutaldesign
	*@link            http://bsign.co
	*@github        http://github.com/brutaldesign/swipebox
	*@version     1.1.2
	*@license      MIT License
*/
/*
(function($){

(function(e,t,n,r){n.swipebox=function(i,s){var o={useCSS:true,hideBarsDelay:3e3},u=this,a=n(i),i=i,f=i.selector,l=n(f),c=t.createTouch!==r||"ontouchstart"in e||"onmsgesturechange"in e||navigator.msMaxTouchPoints,h=!!e.SVGSVGElement,p='<div id="swipebox-overlay">					<div id="swipebox-slider"></div>					<div id="swipebox-caption"></div>					<div id="swipebox-action">						<a id="swipebox-close"></a>						<a id="swipebox-prev"></a>						<a id="swipebox-next"></a>					</div>			</div>';u.settings={};u.init=function(){u.settings=n.extend({},o,s);l.click(function(e){e.preventDefault();e.stopPropagation();index=a.index(n(this));d.target=n(e.target);d.init(index)})};var d={init:function(e){this.target.trigger("swipebox-start");this.build();this.openSlide(e);this.openImg(e);this.preloadImg(e+1);this.preloadImg(e-1)},build:function(){var t=this;n("body").append(p);if(t.doCssTrans()){n("#swipebox-slider").css({"-webkit-transition":"left 0.4s ease","-moz-transition":"left 0.4s ease","-o-transition":"left 0.4s ease","-khtml-transition":"left 0.4s ease",transition:"left 0.4s ease"});n("#swipebox-overlay").css({"-webkit-transition":"opacity 1s ease","-moz-transition":"opacity 1s ease","-o-transition":"opacity 1s ease","-khtml-transition":"opacity 1s ease",transition:"opacity 1s ease"});n("#swipebox-action, #swipebox-caption").css({"-webkit-transition":"0.5s","-moz-transition":"0.5s","-o-transition":"0.5s","-khtml-transition":"0.5s",transition:"0.5s"})}if(h){var r=n("#swipebox-action #swipebox-close").css("background-image");r=r.replace("png","svg");n("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({"background-image":r})}a.each(function(){n("#swipebox-slider").append('<div class="slide"></div>')});t.setDim();t.actions();t.keyboard();t.gesture();t.animBars();n(e).resize(function(){t.setDim()}).resize()},setDim:function(){var t={width:n(e).width(),height:e.innerHeight?e.innerHeight:n(e).height()};n("#swipebox-overlay").css(t)},supportTransition:function(){var e="transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");for(var n=0;n<e.length;n++){if(t.createElement("div").style[e[n]]!==r){return e[n]}}return false},doCssTrans:function(){if(u.settings.useCSS&&this.supportTransition()){return true}},gesture:function(){if(c){var e=this,t=null,r=10,i={},s={};var o=n("#swipebox-caption, #swipebox-action");o.addClass("visible-bars");e.setTimeout();n("body").bind("touchstart",function(e){n(this).addClass("touching");s=e.originalEvent.targetTouches[0];i.pageX=e.originalEvent.targetTouches[0].pageX;n(".touching").bind("touchmove",function(e){e.preventDefault();e.stopPropagation();s=e.originalEvent.targetTouches[0]});return false}).bind("touchend",function(u){u.preventDefault();u.stopPropagation();t=s.pageX-i.pageX;if(t>=r){e.getPrev()}else if(t<=-r){e.getNext()}else{if(!o.hasClass("visible-bars")){e.showBars();e.setTimeout()}else{e.clearTimeout();e.hideBars()}}n(".touching").off("touchmove").removeClass("touching")})}},setTimeout:function(){if(u.settings.hideBarsDelay>0){var t=this;t.clearTimeout();t.timeout=e.setTimeout(function(){t.hideBars()},u.settings.hideBarsDelay)}},clearTimeout:function(){e.clearTimeout(this.timeout);this.timeout=null},showBars:function(){var e=n("#swipebox-caption, #swipebox-action");if(this.doCssTrans()){e.addClass("visible-bars")}else{n("#swipebox-caption").animate({top:0},500);n("#swipebox-action").animate({bottom:0},500);setTimeout(function(){e.addClass("visible-bars")},1e3)}},hideBars:function(){var e=n("#swipebox-caption, #swipebox-action");if(this.doCssTrans()){e.removeClass("visible-bars")}else{n("#swipebox-caption").animate({top:"-50px"},500);n("#swipebox-action").animate({bottom:"-50px"},500);setTimeout(function(){e.removeClass("visible-bars")},1e3)}},animBars:function(){var e=this;var t=n("#swipebox-caption, #swipebox-action");t.addClass("visible-bars");e.setTimeout();n("#swipebox-slider").click(function(n){if(!t.hasClass("visible-bars")){e.showBars();e.setTimeout()}});n("#swipebox-action").hover(function(){e.showBars();t.addClass("force-visible-bars");e.clearTimeout()},function(){t.removeClass("force-visible-bars");e.setTimeout()})},keyboard:function(){var t=this;n(e).bind("keyup",function(e){e.preventDefault();e.stopPropagation();if(e.keyCode==37){t.getPrev()}else if(e.keyCode==39){t.getNext()}else if(e.keyCode==27){t.closeSlide()}})},actions:function(){var e=this;if(a.length<2){n("#swipebox-prev, #swipebox-next").hide()}else{n("#swipebox-prev").bind("click touchend",function(t){t.preventDefault();t.stopPropagation();e.getPrev();e.setTimeout()});n("#swipebox-next").bind("click touchend",function(t){t.preventDefault();t.stopPropagation();e.getNext();e.setTimeout()})}n("#swipebox-close").bind("click touchend",function(t){e.closeSlide()})},setSlide:function(e,t){t=t||false;var r=n("#swipebox-slider");if(this.doCssTrans()){r.css({left:-e*100+"%"})}else{r.animate({left:-e*100+"%"})}n("#swipebox-slider .slide").removeClass("current");n("#swipebox-slider .slide").eq(e).addClass("current");this.setTitle(e);if(t){r.fadeIn()}n("#swipebox-prev, #swipebox-next").removeClass("disabled");if(e==0){n("#swipebox-prev").addClass("disabled")}else if(e==a.length-1){n("#swipebox-next").addClass("disabled")}},openSlide:function(t){n("html").addClass("swipebox");n(e).trigger("resize");this.setSlide(t,true)},preloadImg:function(e){var t=this;setTimeout(function(){t.openImg(e)},1e3)},openImg:function(e){var t=this;if(e<0||e>=a.length){return false}t.loadImg(a.eq(e).attr("href"),function(){n("#swipebox-slider .slide").eq(e).html(this)})},setTitle:function(e,t){n("#swipebox-caption").empty();if(a.eq(e).attr("title")){n("#swipebox-caption").append(a.eq(e).attr("title"))}},loadImg:function(e,t){var r=n("<img>").on("load",function(){t.call(r)});r.attr("src",e)},getNext:function(){var e=this;index=n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));if(index+1<a.length){index++;e.setSlide(index);e.preloadImg(index+1)}else{n("#swipebox-slider").addClass("rightSpring");setTimeout(function(){n("#swipebox-slider").removeClass("rightSpring")},500)}},getPrev:function(){var e=this;index=n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));if(index>0){index--;e.setSlide(index);e.preloadImg(index-1)}else{n("#swipebox-slider").addClass("leftSpring");setTimeout(function(){n("#swipebox-slider").removeClass("leftSpring")},500)}},closeSlide:function(){var t=this;n(e).trigger("resize");n("html").removeClass("swipebox");t.destroy()},destroy:function(){var t=this;n(e).unbind("keyup");n("body").unbind("touchstart");n("body").unbind("touchmove");n("body").unbind("touchend");n("#swipebox-slider").unbind();n("#swipebox-overlay").remove();a.removeData("_swipebox");t.target.trigger("swipebox-destroy")}};u.init()};n.fn.swipebox=function(e){if(!n.data(this,"_swipebox")){var t=new n.swipebox(this,e);this.data("_swipebox",t)}}})(window,document,jQuery)

}(jQuery));
*/










/*
	* Snap.js
	*
	* Copyright 2013, Jacob Kelley - http://jakiestfu.com/
	* Released under the MIT Licence
	* http://opensource.org/licenses/MIT
	*
	* Github:  http://github.com/jakiestfu/Snap.js/
	* Version: 1.9.2
*/
/*jslint browser: true*/
/*global define, module, ender*/

(function($){

(function(e,t){"use strict";var n=n||function(n){var r={element:null,dragger:null,disable:"right",addBodyClasses:true,hyperextensible:false,resistance:.5,flickThreshold:50,transitionSpeed:.3,easing:"ease-in-out",maxPosition:272,minPosition:0,tapToClose:true,touchToDrag:true,slideIntent:40,minDragDistance:5},i={simpleStates:{opening:null,towards:null,hyperExtending:null,halfway:null,flick:null,translation:{absolute:0,relative:0,sinceDirectionChange:0,percentage:0}}},s={},o={hasTouch:t.ontouchstart===null,eventType:function(e){var t={down:o.hasTouch?"touchstart":"mousedown",move:o.hasTouch?"touchmove":"mousemove",up:o.hasTouch?"touchend":"mouseup",out:o.hasTouch?"touchcancel":"mouseout"};return t[e]},page:function(e,t){return o.hasTouch&&t.touches.length&&t.touches[0]?t.touches[0]["page"+e]:t["page"+e]},klass:{has:function(e,t){return e.className.indexOf(t)!==-1},add:function(e,t){if(!o.klass.has(e,t)&&r.addBodyClasses){e.className+=" "+t}},remove:function(e,t){if(r.addBodyClasses){e.className=e.className.replace(t,"").replace(/^\s+|\s+$/g,"")}}},dispatchEvent:function(e){if(typeof s[e]==="function"){return s[e].call()}},vendor:function(){var e=t.createElement("div"),n="webkit Moz O ms".split(" "),r;for(r in n){if(typeof e.style[n[r]+"Transition"]!=="undefined"){return n[r]}}},transitionCallback:function(){return i.vendor==="Moz"||i.vendor==="ms"?"transitionend":i.vendor+"TransitionEnd"},canTransform:function(){return typeof r.element.style[i.vendor+"Transform"]!=="undefined"},deepExtend:function(e,t){var n;for(n in t){if(t[n]&&t[n].constructor&&t[n].constructor===Object){e[n]=e[n]||{};o.deepExtend(e[n],t[n])}else{e[n]=t[n]}}return e},angleOfDrag:function(e,t){var n,r;r=Math.atan2(-(i.startDragY-t),i.startDragX-e);if(r<0){r+=2*Math.PI}n=Math.floor(r*(180/Math.PI)-180);if(n<0&&n>-180){n=360-Math.abs(n)}return Math.abs(n)},events:{addEvent:function(t,n,r){if(t.addEventListener){return t.addEventListener(n,r,false)}else if(t.attachEvent){return t.attachEvent("on"+n,r)}},removeEvent:function(t,n,r){if(t.addEventListener){return t.removeEventListener(n,r,false)}else if(t.attachEvent){return t.detachEvent("on"+n,r)}},prevent:function(e){if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}}},parentUntil:function(e,t){var n=typeof t==="string";while(e.parentNode){if(n&&e.getAttribute&&e.getAttribute(t)){return e}else if(!n&&e===t){return e}e=e.parentNode}return null}},u={translate:{get:{matrix:function(t){if(!o.canTransform()){return parseInt(r.element.style.left,10)}else{var n=e.getComputedStyle(r.element)[i.vendor+"Transform"].match(/\((.*)\)/),s=8;if(n){n=n[1].split(",");if(n.length===16){t+=s}return parseInt(n[t],10)}return 0}}},easeCallback:function(){r.element.style[i.vendor+"Transition"]="";i.translation=u.translate.get.matrix(4);i.easing=false;clearInterval(i.animatingInterval);if(i.easingTo===0){o.klass.remove(t.body,"snapjs-right");o.klass.remove(t.body,"snapjs-left")}o.dispatchEvent("animated");o.events.removeEvent(r.element,o.transitionCallback(),u.translate.easeCallback)},easeTo:function(e){if(!o.canTransform()){i.translation=e;u.translate.x(e)}else{i.easing=true;i.easingTo=e;r.element.style[i.vendor+"Transition"]="all "+r.transitionSpeed+"s "+r.easing;i.animatingInterval=setInterval(function(){o.dispatchEvent("animating")},1);o.events.addEvent(r.element,o.transitionCallback(),u.translate.easeCallback);u.translate.x(e)}if(e===0){r.element.style[i.vendor+"Transform"]=""}},x:function(n){if(r.disable==="left"&&n>0||r.disable==="right"&&n<0){return}if(!r.hyperextensible){if(n===r.maxPosition||n>r.maxPosition){n=r.maxPosition}else if(n===r.minPosition||n<r.minPosition){n=r.minPosition}}n=parseInt(n,10);if(isNaN(n)){n=0}if(o.canTransform()){var s="translate3d("+n+"px, 0,0)";r.element.style[i.vendor+"Transform"]=s}else{r.element.style.width=(e.innerWidth||t.documentElement.clientWidth)+"px";r.element.style.left=n+"px";r.element.style.right=""}}},drag:{listen:function(){i.translation=0;i.easing=false;o.events.addEvent(r.element,o.eventType("down"),u.drag.startDrag);o.events.addEvent(r.element,o.eventType("move"),u.drag.dragging);o.events.addEvent(r.element,o.eventType("up"),u.drag.endDrag)},stopListening:function(){o.events.removeEvent(r.element,o.eventType("down"),u.drag.startDrag);o.events.removeEvent(r.element,o.eventType("move"),u.drag.dragging);o.events.removeEvent(r.element,o.eventType("up"),u.drag.endDrag)},startDrag:function(e){var t=e.target?e.target:e.srcElement,n=o.parentUntil(t,"data-snap-ignore");if(n){o.dispatchEvent("ignore");return}if(r.dragger){var s=o.parentUntil(t,r.dragger);if(!s&&i.translation!==r.minPosition&&i.translation!==r.maxPosition){return}}o.dispatchEvent("start");r.element.style[i.vendor+"Transition"]="";i.isDragging=true;i.hasIntent=null;i.intentChecked=false;i.startDragX=o.page("X",e);i.startDragY=o.page("Y",e);i.dragWatchers={current:0,last:0,hold:0,state:""};i.simpleStates={opening:null,towards:null,hyperExtending:null,halfway:null,flick:null,translation:{absolute:0,relative:0,sinceDirectionChange:0,percentage:0}}},dragging:function(e){if(i.isDragging&&r.touchToDrag){var n=o.page("X",e),s=o.page("Y",e),a=i.translation,f=u.translate.get.matrix(4),l=n-i.startDragX,c=f>0,h=l,p;if(i.intentChecked&&!i.hasIntent){return}if(r.addBodyClasses){if(f>0){o.klass.add(t.body,"snapjs-left");o.klass.remove(t.body,"snapjs-right")}else if(f<0){o.klass.add(t.body,"snapjs-right");o.klass.remove(t.body,"snapjs-left")}}if(i.hasIntent===false||i.hasIntent===null){var d=o.angleOfDrag(n,s),v=d>=0&&d<=r.slideIntent||d<=360&&d>360-r.slideIntent,m=d>=180&&d<=180+r.slideIntent||d<=180&&d>=180-r.slideIntent;if(!m&&!v){i.hasIntent=false}else{i.hasIntent=true}i.intentChecked=true}if(r.minDragDistance>=Math.abs(n-i.startDragX)||i.hasIntent===false){return}o.events.prevent(e);o.dispatchEvent("drag");i.dragWatchers.current=n;if(i.dragWatchers.last>n){if(i.dragWatchers.state!=="left"){i.dragWatchers.state="left";i.dragWatchers.hold=n}i.dragWatchers.last=n}else if(i.dragWatchers.last<n){if(i.dragWatchers.state!=="right"){i.dragWatchers.state="right";i.dragWatchers.hold=n}i.dragWatchers.last=n}if(c){if(r.maxPosition<f){p=(f-r.maxPosition)*r.resistance;h=l-p}i.simpleStates={opening:"left",towards:i.dragWatchers.state,hyperExtending:r.maxPosition<f,halfway:f>r.maxPosition/2,flick:Math.abs(i.dragWatchers.current-i.dragWatchers.hold)>r.flickThreshold,translation:{absolute:f,relative:l,sinceDirectionChange:i.dragWatchers.current-i.dragWatchers.hold,percentage:f/r.maxPosition*100}}}else{if(r.minPosition>f){p=(f-r.minPosition)*r.resistance;h=l-p}i.simpleStates={opening:"right",towards:i.dragWatchers.state,hyperExtending:r.minPosition>f,halfway:f<r.minPosition/2,flick:Math.abs(i.dragWatchers.current-i.dragWatchers.hold)>r.flickThreshold,translation:{absolute:f,relative:l,sinceDirectionChange:i.dragWatchers.current-i.dragWatchers.hold,percentage:f/r.minPosition*100}}}u.translate.x(h+a)}},endDrag:function(e){if(i.isDragging){o.dispatchEvent("end");var t=u.translate.get.matrix(4);if(i.dragWatchers.current===0&&t!==0&&r.tapToClose){o.dispatchEvent("close");o.events.prevent(e);u.translate.easeTo(0);i.isDragging=false;i.startDragX=0;return}if(i.simpleStates.opening==="left"){if(i.simpleStates.halfway||i.simpleStates.hyperExtending||i.simpleStates.flick){if(i.simpleStates.flick&&i.simpleStates.towards==="left"){u.translate.easeTo(0)}else if(i.simpleStates.flick&&i.simpleStates.towards==="right"||i.simpleStates.halfway||i.simpleStates.hyperExtending){u.translate.easeTo(r.maxPosition)}}else{u.translate.easeTo(0)}}else if(i.simpleStates.opening==="right"){if(i.simpleStates.halfway||i.simpleStates.hyperExtending||i.simpleStates.flick){if(i.simpleStates.flick&&i.simpleStates.towards==="right"){u.translate.easeTo(0)}else if(i.simpleStates.flick&&i.simpleStates.towards==="left"||i.simpleStates.halfway||i.simpleStates.hyperExtending){u.translate.easeTo(r.minPosition)}}else{u.translate.easeTo(0)}}i.isDragging=false;i.startDragX=o.page("X",e)}}}},a=function(e){if(e.element){o.deepExtend(r,e);i.vendor=o.vendor();u.drag.listen()}};this.open=function(e){o.dispatchEvent("open");o.klass.remove(t.body,"snapjs-expand-left");o.klass.remove(t.body,"snapjs-expand-right");if(e==="left"){i.simpleStates.opening="left";i.simpleStates.towards="right";o.klass.add(t.body,"snapjs-left");o.klass.remove(t.body,"snapjs-right");u.translate.easeTo(r.maxPosition)}else if(e==="right"){i.simpleStates.opening="right";i.simpleStates.towards="left";o.klass.remove(t.body,"snapjs-left");o.klass.add(t.body,"snapjs-right");u.translate.easeTo(r.minPosition)}};this.close=function(){o.dispatchEvent("close");u.translate.easeTo(0)};this.expand=function(n){var r=e.innerWidth||t.documentElement.clientWidth;if(n==="left"){o.dispatchEvent("expandLeft");o.klass.add(t.body,"snapjs-expand-left");o.klass.remove(t.body,"snapjs-expand-right")}else{o.dispatchEvent("expandRight");o.klass.add(t.body,"snapjs-expand-right");o.klass.remove(t.body,"snapjs-expand-left");r*=-1}u.translate.easeTo(r)};this.on=function(e,t){s[e]=t;return this};this.off=function(e){if(s[e]){s[e]=false}};this.enable=function(){o.dispatchEvent("enable");u.drag.listen()};this.disable=function(){o.dispatchEvent("disable");u.drag.stopListening()};this.settings=function(e){o.deepExtend(r,e)};this.state=function(){var e,t=u.translate.get.matrix(4);if(t===r.maxPosition){e="left"}else if(t===r.minPosition){e="right"}else{e="closed"}return{state:e,info:i.simpleStates}};a(n)};if(typeof module!=="undefined"&&module.exports){module.exports=n}if(typeof ender==="undefined"){this.Snap=n}if(typeof define==="function"&&define.amd){define("snap",[],function(){return n})}}).call(this,window,document)

}(jQuery));


/*
	* countdown is a simple jquery plugin for countdowns
	* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
	* and GPL-3.0 (http://opensource.org/licenses/GPL-3.0) licenses.
	* @source: http://github.com/rendro/countdown/
	* @autor: Robert Fleischmann
	* @version: 1.0.1
*/


(function($){

(function(){(function(e){e.countdown=function(t,n){var r,i=this;this.el=t;this.$el=e(t);this.$el.data("countdown",this);this.init=function(){i.options=e.extend({},e.countdown.defaultOptions,n);if(i.options.refresh){i.interval=setInterval(function(){return i.render()},i.options.refresh)}i.render();return i};r=function(t){var n,r;t=Date.parse(e.isPlainObject(i.options.date)?i.options.date:new Date(i.options.date));r=(t-Date.parse(new Date))/1e3;if(r<=0){r=0;if(i.interval){i.stop()}i.options.onEnd.apply(i)}n={years:0,days:0,hours:0,min:0,sec:0,millisec:0};if(r>=365.25*86400){n.years=Math.floor(r/(365.25*86400));r-=n.years*365.25*86400}if(r>=86400){n.days=Math.floor(r/86400);r-=n.days*86400}if(r>=3600){n.hours=Math.floor(r/3600);r-=n.hours*3600}if(r>=60){n.min=Math.floor(r/60);r-=n.min*60}n.sec=r;return n};this.leadingZeros=function(e,t){if(t==null){t=2}e=String(e);while(e.length<t){e="0"+e}return e};this.update=function(e){i.options.date=e;return i};this.render=function(){i.options.render.apply(i,[r(i.options.date)]);return i};this.stop=function(){if(i.interval){clearInterval(i.interval)}i.interval=null;return i};this.start=function(t){if(t==null){t=i.options.refresh||e.countdown.defaultOptions.refresh}if(i.interval){clearInterval(i.interval)}i.render();i.options.refresh=t;i.interval=setInterval(function(){return i.render()},i.options.refresh);return i};return this.init()};e.countdown.defaultOptions={date:"June 7, 2087 15:03:25",refresh:1e3,onEnd:e.noop,render:function(t){return e(this.el).html(""+t.years+" years, "+t.days+" days, "+this.leadingZeros(t.hours)+" hours, "+this.leadingZeros(t.min)+" min and "+this.leadingZeros(t.sec)+" sec")}};e.fn.countdown=function(t){return e.each(this,function(n,r){var i;i=e(r);if(!i.data("countdown")){return i.data("countdown",new e.countdown(r,t))}})};return void 0})(jQuery)}).call(this)

}(jQuery));

/*
	*jQuery Contact form developed by CosminCotor & Enabled
	*Licensed to be used ONLY by CosminCotor & Enabled on the Envato Marketplaces 
	*DO NOT use in commercial projects outside Regular or Extended licenses for the marketplaces.
*/

(function($){

var $=jQuery.noConflict();var formSubmitted="false";jQuery(document).ready(function(e){function t(t,n){formSubmitted="true";var r=e("#"+t).serialize();e.post(e("#"+t).attr("action"),r,function(n){e("#"+t).hide();e("#formSuccessMessageWrap").fadeIn(500)})}function n(n,r){e(".formValidationError").hide();e(".fieldHasError").removeClass("fieldHasError");e("#"+n+" .requiredField").each(function(i){if(e(this).val()==""||e(this).val()==e(this).attr("data-dummy")){e(this).val(e(this).attr("data-dummy"));e(this).focus();e(this).addClass("fieldHasError");e("#"+e(this).attr("id")+"Error").fadeIn(300);return false}if(e(this).hasClass("requiredEmailField")){var s=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;var o="#"+e(this).attr("id");if(!s.test(e(o).val())){e(o).focus();e(o).addClass("fieldHasError");e(o+"Error2").fadeIn(300);return false}}if(formSubmitted=="false"&&i==e("#"+n+" .requiredField").length-1){t(n,r)}})}e("#formSuccessMessageWrap").hide(0);e(".formValidationError").fadeOut(0);e('input[type="text"], input[type="password"], textarea').focus(function(){if(e(this).val()==e(this).attr("data-dummy")){e(this).val("")}});e("input, textarea").blur(function(){if(e(this).val()==""){e(this).val(e(this).attr("data-dummy"))}});e("#contactSubmitButton").click(function(){n(e(this).attr("data-formId"));return false})})

}(jQuery));



/*!
jQuery Wookmark plugin
@name jquery.wookmark.js
@author Christoph Ono (chri@sto.ph or @gbks)
@author Sebastian Helzle (sebastian@helzle.net or @sebobo)
@version 1.4.5
@date 11/22/2013
@category jQuery plugin
@copyright (c) 2009-2013 Christoph Ono (www.wookmark.com)
@license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function (factory) {
if (typeof define === 'function' && define.amd)
  define(['jquery'], factory);
else
  factory(jQuery);
}(function ($) {
var Wookmark, defaultOptions, __bind;

__bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

// Wookmark default options
defaultOptions = {
  align: 'center',
  autoResize: false,
  comparator: null,
  container: $('body'),
  ignoreInactiveItems: true,
  itemWidth: 0,
  fillEmptySpace: false,
  flexibleWidth: 0,
  direction: undefined,
  offset: 2,
  onLayoutChanged: undefined,
  outerOffset: 0,
  resizeDelay: 50,
  possibleFilters: []
};

// Function for executing css writes to dom on the next animation frame if supported
var executeNextFrame = window.requestAnimationFrame || function(callback) {callback()};

function bulkUpdateCSS(data) {
  executeNextFrame(function() {
    var i, item;
    for (i in data) {
      item = data[i];
      item.obj.css(item.css);
    }
  });
}

function cleanFilterName(filterName) {
  return $.trim(filterName).toLowerCase();
}

// Main wookmark plugin class
Wookmark = (function() {

  function Wookmark(handler, options) {
    // Instance variables.
    this.handler = handler;
    this.columns = this.containerWidth = this.resizeTimer = null;
    this.activeItemCount = 0;
    this.itemHeightsDirty = true;
    this.placeholders = [];

    $.extend(true, this, defaultOptions, options);

    // Bind instance methods
    this.update = __bind(this.update, this);
    this.onResize = __bind(this.onResize, this);
    this.onRefresh = __bind(this.onRefresh, this);
    this.getItemWidth = __bind(this.getItemWidth, this);
    this.layout = __bind(this.layout, this);
    this.layoutFull = __bind(this.layoutFull, this);
    this.layoutColumns = __bind(this.layoutColumns, this);
    this.filter = __bind(this.filter, this);
    this.clear = __bind(this.clear, this);
    this.getActiveItems = __bind(this.getActiveItems, this);
    this.refreshPlaceholders = __bind(this.refreshPlaceholders, this);
    this.sortElements = __bind(this.sortElements, this);
    this.updateFilterClasses = __bind(this.updateFilterClasses, this);

    // Initial update of the filter classes
    this.updateFilterClasses();

    // Listen to resize event if requested.
    if (this.autoResize)
      $(window).bind('resize.wookmark', this.onResize);

    this.container.bind('refreshWookmark', this.onRefresh);
  }

  Wookmark.prototype.updateFilterClasses = function() {
    // Collect filter data
    var i = 0, j = 0, k = 0, filterClasses = {}, itemFilterClasses,
        $item, filterClass, possibleFilters = this.possibleFilters, possibleFilter;

    for (; i < this.handler.length; i++) {
      $item = this.handler.eq(i);

      // Read filter classes and globally store each filter class as object and the fitting items in the array
      itemFilterClasses = $item.data('filterClass');
      if (typeof itemFilterClasses == 'object' && itemFilterClasses.length > 0) {
        for (j = 0; j < itemFilterClasses.length; j++) {
          filterClass = cleanFilterName(itemFilterClasses[j]);

          if (!filterClasses[filterClass]) {
            filterClasses[filterClass] = [];
          }
          filterClasses[filterClass].push($item[0]);
        }
      }
    }

    for (; k < possibleFilters.length; k++) {
      possibleFilter = cleanFilterName(possibleFilters[k]);
      if (!(possibleFilter in filterClasses)) {
        filterClasses[possibleFilter] = [];
      }
    }

    this.filterClasses = filterClasses;
  };

  // Method for updating the plugins options
  Wookmark.prototype.update = function(options) {
    this.itemHeightsDirty = true;
    $.extend(true, this, options);
  };

  // This timer ensures that layout is not continuously called as window is being dragged.
  Wookmark.prototype.onResize = function() {
    clearTimeout(this.resizeTimer);
    this.itemHeightsDirty = this.flexibleWidth !== 0;
    this.resizeTimer = setTimeout(this.layout, this.resizeDelay);
  };

  // Marks the items heights as dirty and does a relayout
  Wookmark.prototype.onRefresh = function() {
    this.itemHeightsDirty = true;
    this.layout();
  };

  /**
   * Filters the active items with the given string filters.
   * @param filters array of string
   * @param mode 'or' or 'and'
   */
  Wookmark.prototype.filter = function(filters, mode) {
    var activeFilters = [], activeFiltersLength, activeItems = $(),
        i, j, k, filter;

    filters = filters || [];
    mode = mode || 'or';

    if (filters.length) {
      // Collect active filters
      for (i = 0; i < filters.length; i++) {
        filter = cleanFilterName(filters[i]);
        if (filter in this.filterClasses) {
          activeFilters.push(this.filterClasses[filter]);
        }
      }

      // Get items for active filters with the selected mode
      activeFiltersLength = activeFilters.length;
      if (mode == 'or' || activeFiltersLength == 1) {
        // Set all items in all active filters active
        for (i = 0; i < activeFiltersLength; i++) {
          activeItems = activeItems.add(activeFilters[i]);
        }
      } else if (mode == 'and') {
        var shortestFilter = activeFilters[0],
            itemValid = true, foundInFilter,
            currentItem, currentFilter;

        // Find shortest filter class
        for (i = 1; i < activeFiltersLength; i++) {
          if (activeFilters[i].length < shortestFilter.length) {
            shortestFilter = activeFilters[i];
          }
        }

        // Iterate over shortest filter and find elements in other filter classes
        shortestFilter = shortestFilter || [];
        for (i = 0; i < shortestFilter.length; i++) {
          currentItem = shortestFilter[i];
          itemValid = true;

          for (j = 0; j < activeFilters.length && itemValid; j++) {
            currentFilter = activeFilters[j];
            if (shortestFilter == currentFilter) continue;

            // Search for current item in each active filter class
            for (k = 0, foundInFilter = false; k < currentFilter.length && !foundInFilter; k++) {
              foundInFilter = currentFilter[k] == currentItem;
            }
            itemValid &= foundInFilter;
          }
          if (itemValid)
            activeItems.push(shortestFilter[i]);
        }
      }
      // Hide inactive items
      this.handler.not(activeItems).addClass('inactive');
    } else {
      // Show all items if no filter is selected
      activeItems = this.handler;
    }

    // Show active items
    activeItems.removeClass('inactive');

    // Unset columns and refresh grid for a full layout
    this.columns = null;
    this.layout();
  };

  /**
   * Creates or updates existing placeholders to create columns of even height
   */
  Wookmark.prototype.refreshPlaceholders = function(columnWidth, sideOffset) {
    var i = this.placeholders.length,
        $placeholder, $lastColumnItem,
        columnsLength = this.columns.length, column,
        height, top, innerOffset,
        containerHeight = this.container.innerHeight();

    for (; i < columnsLength; i++) {
      $placeholder = $('<div class="wookmark-placeholder"/>').appendTo(this.container);
      this.placeholders.push($placeholder);
    }

    innerOffset = this.offset + parseInt(this.placeholders[0].css('borderLeftWidth'), 10) * 2;

    for (i = 0; i < this.placeholders.length; i++) {
      $placeholder = this.placeholders[i];
      column = this.columns[i];

      if (i >= columnsLength || !column[column.length - 1]) {
        $placeholder.css('display', 'none');
      } else {
        $lastColumnItem = column[column.length - 1];
        if (!$lastColumnItem) continue;
        top = $lastColumnItem.data('wookmark-top') + $lastColumnItem.data('wookmark-height') + this.offset;
        height = containerHeight - top - innerOffset;

        $placeholder.css({
          position: 'absolute',
          display: height > 0 ? 'block' : 'none',
          left: i * columnWidth + sideOffset,
          top: top,
          width: columnWidth - innerOffset,
          height: height
        });
      }
    }
  };

  // Method the get active items which are not disabled and visible
  Wookmark.prototype.getActiveItems = function() {
    return this.ignoreInactiveItems ? this.handler.not('.inactive') : this.handler;
  };

  // Method to get the standard item width
  Wookmark.prototype.getItemWidth = function() {
    var itemWidth = this.itemWidth,
        innerWidth = this.container.width() - 2 * this.outerOffset,
        firstElement = this.handler.eq(0),
        flexibleWidth = this.flexibleWidth;
    

    if (this.itemWidth === undefined || this.itemWidth === 0 && !this.flexibleWidth) {
      itemWidth = firstElement.outerWidth();
    }
    else if (typeof this.itemWidth == 'string' && this.itemWidth.indexOf('%') >= 0) {
      itemWidth = parseFloat(this.itemWidth) / 100 * innerWidth;
    }

    // Calculate flexible item width if option is set
    if (flexibleWidth) {
      if (typeof flexibleWidth == 'string' && flexibleWidth.indexOf('%') >= 0) {
        flexibleWidth = parseFloat(flexibleWidth) / 100 * innerWidth;
      }
      //var columns = ~~(0.5 + (innerWidth + this.offset) / (flexibleWidth + this.offset)),
      //var columns = Math.max(1, ~~(0.5 + (innerWidth + this.offset) / (flexibleWidth + this.offset)));
      console.log(innerWidth);
      console.log(this.offset);
      console.log(flexibleWidth);      
      var columns = 1;
      if(innerWidth > 650 && innerWidth < 900){
    	  columns = 2;
      }else if(innerWidth > 900){
    	  columns = 3; 
      }
      var columnWidth = Math.min(flexibleWidth, ~~((innerWidth - (columns - 1) * this.offset) / columns));
      
      //console.log(columns);
      //console.log(flexibleWidth);
      ///console.log(innerWidth);	
      //console.log(itemWidth);
      //console.log(columnWidth);	
      itemWidth = Math.max(itemWidth, columnWidth);
     //console.log(itemWidth);
      // Stretch items to fill calculated width
      this.handler.css('width', itemWidth);
    }
    
    return itemWidth;
  };

  // Main layout method.
  Wookmark.prototype.layout = function(force) {
    // Do nothing if container isn't visible
    if (!this.container.is(':visible')) return;

    // Calculate basic layout parameters.
    var columnWidth = this.getItemWidth() + this.offset,
        containerWidth = this.container.width(),
        innerWidth = containerWidth - 2 * this.outerOffset,
        columns = ~~((innerWidth + this.offset) / columnWidth),
        offset = 0, maxHeight = 0, i = 0,
        activeItems = this.getActiveItems(),
        activeItemsLength = activeItems.length,
        $item;

    // Cache item height
    if (this.itemHeightsDirty || !this.container.data('itemHeightsInitialized')) {
      for (; i < activeItemsLength; i++) {
        $item = activeItems.eq(i);
        $item.data('wookmark-height', $item.outerHeight());
      }
      this.itemHeightsDirty = false;
      this.container.data('itemHeightsInitialized', true);
    }

    // Use less columns if there are to few items
    columns = Math.max(1, Math.min(columns, activeItemsLength));

    // Calculate the offset based on the alignment of columns to the parent container
    offset = this.outerOffset;
    if (this.align == 'center') {
      offset += ~~(0.5 + (innerWidth - (columns * columnWidth - this.offset)) >> 1);
    }

    // Get direction for positioning
    this.direction = this.direction || (this.align == 'right' ? 'right' : 'left');

    // If container and column count hasn't changed, we can only update the columns.
    if (!force && this.columns !== null && this.columns.length == columns && this.activeItemCount == activeItemsLength) {
      maxHeight = this.layoutColumns(columnWidth, offset);
    } else {
      maxHeight = this.layoutFull(columnWidth, columns, offset);
    }
    this.activeItemCount = activeItemsLength;

    // Set container height to height of the grid.
    this.container.css('height', maxHeight);

    // Update placeholders
    if (this.fillEmptySpace) {
      this.refreshPlaceholders(columnWidth, offset);
    }

    if (this.onLayoutChanged !== undefined && typeof this.onLayoutChanged === 'function') {
      this.onLayoutChanged();
    }
  };

  /**
   * Sort elements with configurable comparator
   */
  Wookmark.prototype.sortElements = function(elements) {
    return typeof(this.comparator) === 'function' ? elements.sort(this.comparator) : elements;
  };

  /**
   * Perform a full layout update.
   */
  Wookmark.prototype.layoutFull = function(columnWidth, columns, offset) {
    var $item, i = 0, k = 0,
        activeItems = $.makeArray(this.getActiveItems()),
        length = activeItems.length,
        shortest = null, shortestIndex = null,
        sideOffset, heights = [], itemBulkCSS = [],
        leftAligned = this.align == 'left' ? true : false;

    this.columns = [];

    // Sort elements before layouting
    activeItems = this.sortElements(activeItems);

    // Prepare arrays to store height of columns and items.
    while (heights.length < columns) {
      heights.push(this.outerOffset);
      this.columns.push([]);
    }

    // Loop over items.
    for (; i < length; i++ ) {
      $item = $(activeItems[i]);

      // Find the shortest column.
      shortest = heights[0];
      shortestIndex = 0;
      for (k = 0; k < columns; k++) {
        if (heights[k] < shortest) {
          shortest = heights[k];
          shortestIndex = k;
        }
      }
      $item.data('wookmark-top', shortest);

      // stick to left side if alignment is left and this is the first column
      sideOffset = offset;
      if (shortestIndex > 0 || !leftAligned)
        sideOffset += shortestIndex * columnWidth;

      // Position the item.
      (itemBulkCSS[i] = {
        obj: $item,
        css: {
          position: 'absolute',
          top: shortest
        }
      }).css[this.direction] = sideOffset;

      // Update column height and store item in shortest column
      heights[shortestIndex] += $item.data('wookmark-height') + this.offset;
      this.columns[shortestIndex].push($item);
    }

    bulkUpdateCSS(itemBulkCSS);

    // Return longest column
    return Math.max.apply(Math, heights);
  };

  /**
   * This layout method only updates the vertical position of the
   * existing column assignments.
   */
  Wookmark.prototype.layoutColumns = function(columnWidth, offset) {
    var heights = [], itemBulkCSS = [],
        i = 0, k = 0, j = 0, currentHeight,
        column, $item, itemData, sideOffset;

    for (; i < this.columns.length; i++) {
      heights.push(this.outerOffset);
      column = this.columns[i];
      sideOffset = i * columnWidth + offset;
      currentHeight = heights[i];

      for (k = 0; k < column.length; k++, j++) {
        $item = column[k].data('wookmark-top', currentHeight);
        (itemBulkCSS[j] = {
          obj: $item,
          css: {
            top: currentHeight
          }
        }).css[this.direction] = sideOffset;

        currentHeight += $item.data('wookmark-height') + this.offset;
      }
      heights[i] = currentHeight;
    }

    bulkUpdateCSS(itemBulkCSS);

    // Return longest column
    return Math.max.apply(Math, heights);
  };

  /**
   * Clear event listeners and time outs and the instance itself
   */
  Wookmark.prototype.clear = function() {
    clearTimeout(this.resizeTimer);
    $(window).unbind('resize.wookmark', this.onResize);
    this.container.unbind('refreshWookmark', this.onRefresh);
    this.handler.wookmarkInstance = null;
  };

  return Wookmark;
})();

$.fn.wookmark = function(options) {
  // Create a wookmark instance if not available
  if (!this.wookmarkInstance) {
    this.wookmarkInstance = new Wookmark(this, options || {});
  } else {
    this.wookmarkInstance.update(options || {});
  }

  // Apply layout
  this.wookmarkInstance.layout(true);

  // Display items (if hidden) and return jQuery object to maintain chainability
  return this.show();
};
}));





var options = {
    itemWidth:200, // Optional min width of a grid item
    autoResize: true, // This will auto-update the layout when the browser window is resized.
    container: jQuery('.blockCoupon'), // Optional, used for some extra CSS styling
    offset:5, // Optional, the distance between grid items
    outerOffset:2, // Optional the distance from grid to parent
    flexibleWidth:645 // Optional, the maximum width of a grid item
};
var handler = '';


jQuery(document).ready(function(){
	handler = jQuery('.blockCoupon .photokupon');
    handler.wookmark(options);
	
	var snapper = new Snap({
		  element: document.getElementById('content')
		});
	jQuery('.open-nav, .close-nav').click(function(){
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="left" ){
			snapper.close();
		} else {
			snapper.open('left');
		}
		return false;
	});
	jQuery('.submenu-deploy').click(function(){
		jQuery(this).parent().find('.nav-submenu').toggle(100);
		jQuery(this).parent().find('.sidebar-decoration').toggle(100);
		jQuery(this).toggleClass('active-submenu');
		return false;
	});
	jQuery(".submitSer").click(function(){
		var value = jQuery('.row #query').val();
	    if(value.length >= 3){
	    	jQuery(".derrr").submit();
	    }else if(value.length <= 0){
	    	deff();
	    }
	});
	jQuery('.row #query').keyup(function(){
		var value = jQuery(this).val();
	    if(value.length >= 3){
	    	searchE();
	    }else if(value.length <= 0){
	    	deff();
	    }
    });
	var throttle = '';
	function searchE(){
		jQuery('.label2').show();
		jQuery('.center-table .derrr').css( "top", 0);
		jQuery('.center-table .derrr').css( "transform", "none");
		
		if (throttle != '') { clearTimeout(throttle); }
		throttle = setTimeout(function () {
			jQuery(".derrr").submit();
		}, 1500); 
	}
	jQuery(".derrr").submit(function(e){
		if(zapross == 1)return;
	    var postData = new Array();
	    var formURL = 'http://anncoupons.com/search?format=raw&air=1';
	    if(queryS == jQuery(".row #query").val())return;
	    queryS = jQuery(".row #query").val();
	    postData.push({name: 'query', value: jQuery(".row #query").val()});
	    zapross = 1;
	    deff();
	    jQuery(".submitSer .label").addClass('labelL').removeClass('label');
	    jQuery.ajax({
	        url : formURL,
	        type: "POST",
	        data : postData,
	        success:function(data, textStatus, jqXHR){
	    		scroll1(0);
	    		deff();
	    		hjj = jQuery(data);
	    		hjjO = 0;
	    		zapross = 0;
	    		getPagee = 0;
	    		jQuery(".submitSer .labelL").addClass('label').removeClass('labelL');
	    		if(hjj.length){
	    			searchV = true;
	    			animm();
	    		}
	    		//setTimeout(function () { zapross = 0 }, 1000); 
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	            //if fails      
	        }
	    });
	    e.preventDefault(); //STOP default action
	});
	function deff(){
		jQuery('.seasrchResult .newsearchV').remove();
		searchV = false;
	}
	window.postAndRedirect = function (url, postData){  
	    var postFormStr = "<form method='POST' action='" + url + "'>\n";

	    for (var key in postData){
	        if (postData.hasOwnProperty(key)){
	            postFormStr += "<input type='hidden' name='" + key + "' value='" + postData[key] + "'></input>";
	        }
	    }
	    postFormStr += "</form>";
	    var formElement = jQuery(postFormStr);
	    jQuery('body').append(formElement);
	    jQuery(formElement).submit();
	}
	function animm(){
		if(zapross == 1 || getPagee == 1)return;
		jQuery('.seasrchResult').append(hjj[hjjO]);
		//jQuery('.all-elements').css("margin-top", jQuery('.seasrchResult').height());
		
		
		hjjO++;
		if(hjjO < hjj.length){
			setTimeout(animm, 100); 
		}  
	}
	jQuery(".change_city").click(function(){	
		toggle_block('towns');
	});
	jQuery(".Details").click(function(){
		if(jQuery(this).parent().parent().height() == 150){
			var giip = jQuery(this).parent().parent().find('.dopSpe').height()+170;
			console.log(giip);
			jQuery(this).parent().parent().css('height', giip);
		}else{
			jQuery(this).parent().parent().css('height', '150');
		}
		handler.wookmark(); 
	});
	if(jQuery('.slide-box')){
		var hj = jQuery('.slide-box').clone();
		jQuery('.slide-box').remove();
		hj.insertBefore('#gkRight #gkRightTop');
		jQuery('.slide-box').show();
	}
	//alert(jQuery('#gal34').html());
	if(!jQuery('#gal34').html()){
		jQuery('#komp43').css('padding-left', 0);
	}
	var inff = jQuery('.info-block_bg1.box.inforr');
	if(jQuery(inff).height() > 220){
		jQuery(inff).css('height', '180px');
		jQuery(inff).css('overflow', 'hidden');
		jQuery("#rastyazh").show();
		jQuery("#podr22").show();
	}
	jQuery("#podr22").click(function() {
		jQuery(inff).css('height', 'auto');
		jQuery(inff).css('padding-bottom', '15px');
		jQuery("#podrless").show();	
		jQuery("#podr22").hide();		
	});
	jQuery("#podrless").click(function() {
		jQuery(inff).css('height', '180px');
		jQuery(inff).css('padding-bottom', '0');
		jQuery("#podrless").hide();	
		jQuery("#podr22").show();	
	});
	jQuery("ul#fotogal23 li img").click(function() {
		//alert(jQuery(this).attr('src'));	
		jQuery("img#show-big-photo").attr('src', jQuery(this).attr('src'));
	});
	jQuery("ul#fotogaNewcars li img").click(function() {
		var sttr = jQuery(this).attr('src').replace('_t.jpg', '.jpg');
		jQuery(this).attr('src', jQuery("img#show-big-photo").attr('src').replace('.jpg', '_t.jpg'));
		jQuery("img#show-big-photo").attr('src', sttr);
	});
	function toggle_block(el){
	   var dd_box_wrap = jQuery('#dd-box-wrap'); 
	   var townsWrap = jQuery('.townsWrap');
	   dd_box_wrap.slideUp(250);
	   townsWrap.hide();
	   var obj = jQuery('#' + el);
	   if(obj.css('display') != 'none') {
	      dd_box_wrap.slideUp(250);
		  //townsWrap.hide();
	      setTimeout(function(){
	         obj.hide();
	      }, 250);
	   }
	   else {
	      dd_box_wrap.find('div.dd-box-item').hide();
	      dd_box_wrap.slideDown(250);
		  townsWrap.fadeIn(500);
	      setTimeout(function(){
	         obj.show();
	      }, 250);
	   }
	}
	jQuery(".zoo-category-list > li").mouseover(function() {
		jQuery(this).find('ul').addClass('klllll12');
	}).mouseout(function(){
		jQuery(this).find('ul').removeClass('klllll12');
	});

	function getURLParameter(name) {
	    return decodeURI(
	        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	    );
	}

	

	jQuery( "#SignUpButton" ).click(function() {
		subbEmail();
	});
	jQuery('#memsubscription').on("keyup keypress", function(e) {
		  var code = e.keyCode || e.which; 
		  if (code  == 13) {               
		    e.preventDefault();
		    subbEmail();
		    return false;
		  }
	});
	
	
	function subbEmail(){
		emailAddress = jQuery("#email1").val();		
		if(isValidEmailAddress(emailAddress)){
		    var postData = new Array();
		    var formURL = '/component/users/?task=registration.register&subscription=1';
		    postData.push({name: 'task', value:'registration.register'});
		    postData.push({name: 'idstore', value: jQuery("input[name='idstore']").val()});
		    postData.push({name: 'store', value: jQuery("input[name='store']").val()});
		    postData.push({name: 'option', value:'com_users'});
		    postData.push({name: 'email1', value: jQuery("input[name='email1']").val()});
		    jQuery.ajax({
		        url : formURL,
		        type: "POST",
		        data : postData,
		        success:function(data, textStatus, jqXHR){
			    	if(data == 'ok'){
				   		jQuery("#EmailThankYou").show();
				   		jQuery("#email1").val('');
				   		
				    }
		        },
		        error: function(jqXHR, textStatus, errorThrown){    }
		    });

			
			/*jQuery.post('/component/users/?task=registration.register&subscription=1', jQuery("#memsubscription").serialize() )
				.done(function( data ) {
				   if(data == 'ok'){
				   		jQuery("#EmailThankYou").show();
				   		jQuery("#email1").val('');
				   		
				   }
				});
				*/
		}		
	}
	
	function isValidEmailAddress(emailAddress) {
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(emailAddress);
	};
	function getCouponDATA() {
		if(window.location.hash == '' && !jQuery('meta[property="og:image"]').length){
			return false;
		}
		if(window.location.hash != '' && window.location.hash.indexOf('.jpg')>-1 
				|| window.location.hash.indexOf('.png')>-1 || window.location.hash.indexOf('.gif')>-1){
			return '/images/printablecoupons/'+window.location.hash.substring(1);
		}else if(jQuery('meta[property="og:image"]').length){
			if(jQuery('meta[property="og:image"]').attr('content') != '' && jQuery('meta[property="og:image"]').attr('content').indexOf('.jpg')>-1 || jQuery('meta[property="og:image"]').attr('content').indexOf('.png')>-1 || jQuery('meta[property="og:image"]').attr('content').indexOf('.gif')>-1){
				return jQuery('meta[property="og:image"]').attr('content');
			}
		}
	}
	if(ddd = getCouponDATA()){
		jQuery(".gkPopupWrap").append('<img style="" src="'+ddd+'" />');
		jQuery(".gkPopupWrap img").load(function() {
			jQuery("#gkPopupRegister").show();
			jQuery("#gkPopupOverlay").show();
			jQuery(".mixGreen").show();
			jQuery(".redemption-title").hide();
			resizeCoup(this);
		    jQuery(window).resize(function() {
		    	resizeCoup(this);
    		});
		    window.setTimeout('scroll1(0)', 1000);
		    jQuery(".gkPopupWrap2").attr('class', 'gkPopupWrap');
		});
	}else if(window.location.hash != ''){
		jQuery(".gkPopupWrap").text(window.location.hash.substring(1));
		jQuery("#gkPopupRegister").show();
		jQuery("#gkPopupOverlay").show();	
		jQuery(".mixGreen").hide();	
		jQuery(".redemption-title").show();	
		jQuery(".gkPopupWrap").attr('class', 'gkPopupWrap2');
		jQuery.getScript( "/js/jquery.zclip.min.js", function( data, textStatus, jqxhr ) {
			jQuery('.redemption-title').zclip({
				path:'/js/ZeroClipboard.swf',
				copy:function(){
					return jQuery('.gkPopupWrap2').text();
				},
				afterCopy:function(){
					jQuery('.redemption-title').text('OK');
					jQuery('.redemption-title').addClass('click');
				}
			});
		});
			

	     window.setTimeout(scroll1, 1000);
	}
	jQuery( "#gkPopupOverlay, .mainCloser" ).click(function() {
		jQuery("#gkPopupRegister").hide();
		jQuery("#gkPopupOverlay").hide();
		window.location.hash="";
	});
	jQuery(window).bind('hashchange', function() {
		if(location.hash!=''){
			location.reload();
		}
	});
	
	window.setTimeout(oneSec, 1000);
	if(jQuery('.box.addYourCoupon').length){
		//jQuery('.box.addYourCoupon > div').eq(0).html(jQuery('.box.addYourCoupon > div').eq(0).attr('rel')+'<br>'+jQuery('.box.addYourCoupon > div').eq(0).attr('rel1'));
		//jQuery('.addYourCoupon2').html(jQuery('.addYourCoupon2').attr('rel')); 
		jQuery('.addYourCoupon2').click(function(){
			
			jQuery.ajax({
		        url : '/submitsubmit/?format=raw',
		        type: "POST",
		        data : {id: 222},
		        success:function(data, textStatus, jqXHR){
		    		jQuery('#subCou').html(jQuery(data).find('#item-submission'));
		    		//jQuery('.blockCouponss').html(jQuery('.blockCouponss').attr('rel'));
		    		
		    		jQuery(".radio-button-list > li").on( "click", function() {
		    			var value = jQuery(this).index(); 
		    			jQuery(".radio-button-list > li div").removeClass('selected');
		    			jQuery(this).find('div').addClass('selected');
		    			jQuery('#subCou fieldset').hide();
		    			jQuery('#subCou fieldset').eq(value).show();
		    			jQuery(".code-field.description").attr('name', '');
		    			if(value == 0){
		    				jQuery('#subCou').animate({height: "560px"}, 600);
		    				jQuery(".code-field.description").eq(0).attr('name', 'elements[a8594cbd-d985-4444-9565-8c1732fcf6f8][0][value]');
		    			}else if(value == 1){
		    				jQuery('#subCou').animate({height: "640px"}, 600);
		    				jQuery(".code-field.description").eq(1).attr('name', 'elements[a8594cbd-d985-4444-9565-8c1732fcf6f8][0][value]');
		    			}else{
		    				jQuery('#subCou').animate({height: "470px"}, 600); 
		    				jQuery(".code-field.description").eq(2).attr('name', 'elements[a8594cbd-d985-4444-9565-8c1732fcf6f8][0][value]');
		    			}
		    		});
		    		
		    		jQuery.getScript("/js/date.js", function( data, textStatus, jqxhr ) {
		    			jQuery.getScript("/js/timepicker.js", function( data, textStatus, jqxhr ) {
		    				jQuery.getScript("/js/submission.js", function( data, textStatus, jqxhr ) {
		    					jQuery.getScript("/js/item.js", function( data, textStatus, jqxhr ) {
		    						jQuery(function(jQuery) { 
		    							jQuery("body").Calendar({ translations: {"closeText":"Done","currentText":"Today","dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], "prevText":"Prev","nextText":"Next","weekHeader":"Wk","appendText":"(yyyy-mm-dd)"}}); 
		    						});
	    							jQuery(function(jQuery) {
	    									jQuery("#item-submission").EditItem();
	    									jQuery("#item-submission").Submission({ uri: "http://anncoupons.com/" });
	    							});
	    							jQuery('#subCou').show().animate({height: "640px"}, 400);
	    							
	    							jQuery("input#idCompp").val(jQuery("input[name='idstore']").val());
	    							jQuery( ".submit.section.clearfix #submit-button" ).click(function() {
	    								
	    								var form = new FormData(jQuery('#item-submission')[0]);

	    							        // Make the ajax call
    							        jQuery.ajax({
    							            url: '/submitsubmit',
    							            type: 'POST',
    							            xhr: function() {
    							                var myXhr = jQuery.ajaxSettings.xhr();
    							                if(myXhr.upload){
    							                    myXhr.upload.addEventListener('progress',progress, false);
    							                }
    							                return myXhr;
    							            },
    							            //add beforesend handler to validate or something
    							            //beforeSend: functionname,
    							            success: function (res) {
    							            	jQuery('#subCou').html('<div style="font-size: 110px;padding: 50px 0 0;text-align: center;">OK</div>');
	    									  	jQuery('#subCou').animate({height: "160px"}, 400);
    							            },
    							            //add error handler for when a error occurs if you want!
    							            //error: errorfunction,
    							            data: form,
    							            // this is the important stuf you need to overide the usual post behavior
    							            cache: false,
    							            contentType: false,
    							            processData: false
    							        });
	    								
	    								
	    								/*jQuery.ajax({
		    							      type: "POST",
		    							      url: "/submitsubmit",
		    							     // data: jQuery("#item-submission").serialize(),
		    							      data: new FormData(jQuery("#item-submission")),
		    							      success: function(msg) {
		    								    //alert( "Data Saved: " + msg );
	    									  	jQuery('#subCou').html('<div style="font-size: 110px;padding: 50px 0 0;text-align: center;">OK</div>');
	    									  	jQuery('#subCou').animate({height: "160px"}, 400);
		    							      }
		    						    })*/
	    							});
	    							
					    		});
				    		});
			    		});
		    		});
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		            //if fails      
		        }
		    });
		});

	}

	handler.wookmark(); 
	
	jQuery(window).resize(function() {
		toCenterJavaS();
	})
	toCenterJavaS();
});
function getPAge(formURL){
	getPagee = 1; 
	
	if(formURL.indexOf('format=raw')==-1){
		formURL = formURL+'?format=raw&air=1';
	}

	jQuery.ajax({
		url : formURL,
		type: "GET",
		success:function(data, textStatus, jqXHR){
			zapross = 0;
			jQuery('.all-elements #content #helpDiv').remove();
			jQuery('.all-elements #content').remove( ".firstScreen.center-table" );
			jQuery('.all-elements #content .firstScreen.center-table').after(data);
			jQuery('.seasrchResult .newsearchV').remove();
			jQuery('body > .firstScreen').css('height', 0);
			jQuery('.all-elements').show();
			jQuery('footer').show();
			jQuery('body > .center-table .derrr').css( "top", -200);
			
			//jQuery('body > .firstScreen').animate({
			//    'height': '0',
			//}, 1000, function() {
			//	jQuery('body > .firstScreen').remove();
			//});
			setTimeout(function () { jQuery('body > .firstScreen').remove(); }, 2000); 
			jQuery('body > .center-table .derrr').css( "transform", "none");
			//jQuery('.all-elements').css("margin-top", 140);
			
		},error: function(jqXHR, textStatus, errorThrown){
			//if fails      
		}
	});
}
function toCenterJavaS(){
	if(jQuery('.toCenterJavaS').length > 0){
		var widdd = Math.floor(jQuery(window).width()/114);
		//alert(Math.floor(widdd));
		jQuery('.toCenterJavaS .photokupon2').width(114*widdd);
	}
}
function progress(e){
    if(e.lengthComputable){
    	//jQuery('progress').attr({value:e.loaded,max:e.total});
    }
}
var mobRes = 0;
function mobileREk(){
	//var pdiv = jQuery('.blockCoupon .photokupon').eq(0);
	jQuery('.blockCoupon .photokupon').eq(2).insertAfter(jQuery('.blockCoupon .photokupon').eq(0));
	
	//pdiv = jQuery('.blockCoupon .photokupon').eq(3);
	jQuery('.blockCoupon .photokupon').eq(3).insertBefore(jQuery('.blockCoupon .photokupon').eq(5));
	
	//var pdiv = jQuery('.blockCoupon .photokupon').eq(10);
	jQuery('.blockCoupon .photokupon').eq(10).insertBefore(jQuery('.blockCoupon .photokupon').eq(12));

	//var pdiv = jQuery('.blockCoupon .photokupon').eq(9);
	jQuery('.blockCoupon .photokupon').eq(9).insertBefore(jQuery('.blockCoupon .photokupon').eq(11));
	mobRes = 1;
}
if(typeof isMobile !== 'undefined'){
	var sww = 0;
	jQuery("#menu-toggle").click(function(){
		if(sww == 0){
			jQuery('#menu').show();
			jQuery('#menu').animate({
				opacity: 1,
			    'margin-left': '0',
			}, 300, function() {
				  sww = 1;
			});
		}else{
			jQuery('#menu').hide();
			jQuery('#menu').css('margin-left', '-20px')
			sww = 0;
		}
	})
}
function resizeCoup(ttt){
	if(widthC == 0 || heightC == 0){
		heightC = jQuery(ttt).height();
		widthC = jQuery(ttt).width();
	}
	//if((jQuery("#gkPopupRegister").width()+10) > jQuery(window).width() || (jQuery("#gkPopupRegister").width()-10) < jQuery(window).width()){
    	widthCou = jQuery(window).width()-85;
    	
    	console.log(jQuery(window).width()+ ' //// ' + widthCou); 
    	jQuery(".gkPopupWrap img").width(widthCou-(widthCou/10*2));
    	jQuery(".gkPopupWrap img").css('max-width', widthC );
    	jQuery(".gkPopupWrap img").css('height', 'auto');

    //}
    if(jQuery("#gkPopupRegister").height() > jQuery(window).height()){
    	heightCou = jQuery(window).height()-165;
    	var koo = jQuery(".gkPopupWrap img").height()/heightCou;
    	console.log(jQuery(".gkPopupWrap img").height()+ ' //// ' + heightCou); 
    	widthCou = jQuery(".gkPopupWrap img").width()/koo;
    	console.log(koo); 
    	jQuery(".gkPopupWrap img").height(heightCou);
    	jQuery(".gkPopupWrap img").width(widthCou);
    }
    jQuery("#gkPopupRegister").width(jQuery(".gkPopupWrap img").width()+41);
	jQuery("#gkPopupRegister").css('margin-left', -(jQuery(".gkPopupWrap img").width()+41)/2);
	scroll1(0);
}
function scroll1(rt){
	jQuery("html,body").animate({ scrollTop: rt }, 600);
}
function oneSec(){
	jQuery(".blockCoupon div.photokupon").each(function() {
		var Pppoo = jQuery(this).find('div.ppoo');
		if(jQuery(Pppoo).attr('data-offerid')!='' && jQuery(Pppoo).attr('data-offerid')!= undefined){
			var klll = jQuery(Pppoo).attr('data-offerid');
			var poll = '';
			if(klll.indexOf('images')==-1){
				poll = "/re.php?"+jQuery(Pppoo).attr('data-offerid');
			}else{
				poll = jQuery(Pppoo).attr('data-offerid');
			}		
			//var gg = "<a rel='nofollow' href='"+poll+"' target='_blank'>"+jQuery(Pppoo).text()+"</a>";
			//jQuery(Pppoo).html(trim(gg));
			//jQuery(Pppoo).find('a').attr('href', poll); 
			//gg = "<a class='loadd' rel='nofollow' href='"+poll+"' target='_blank'>"+jQuery(this).find('.forIMg').html()+"</a>";
			//console.log(jQuery(this).find('.forIMg').children('a'));
			//jQuery(this).find('.forIMg').children('a').attr('href', poll); 
			if(poll.indexOf('re.php') > -1){
				jQuery(Pppoo).find('a').click(function(){
					console.log( jQuery(this).parent().parent().parent() );
					//window.location = jQuery(this).parent().parent().parent().find('.labelY').children('a').attr('href'); 
					window.location = poll; 
				});
			}
		}			
	});
	jQuery(function() {
		jQuery(".forIMg img.primage, .rrryle").show().lazyload({
		    threshold : 200,
		    effect : "fadeIn"
		});
	});
}

function trim(ff) {
   return ff.replace(/^\s*/, "").replace(/\s*$/, "");
}
function openURL(urlString){
	myURL = encodeURI(urlString);
	//window.open(myURL, '_blank'); 
	window.open(myURL, '_system');
}