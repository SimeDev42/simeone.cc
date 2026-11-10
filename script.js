document.documentElement.classList.add("js");

(function(){
  var root=document.documentElement;
  var themeBtn=document.getElementById("theme");
  var themeColorMeta=document.querySelector('meta[name="theme-color"]');
  function applyTheme(t){
    if(t==="light"){
      root.setAttribute("data-theme","light");
      if(themeBtn) themeBtn.setAttribute("aria-label","Switch to dark theme");
      if(themeColorMeta) themeColorMeta.setAttribute("content","#FFFFFF");
    } else {
      root.setAttribute("data-theme","dark");
      if(themeBtn) themeBtn.setAttribute("aria-label","Switch to light theme");
      if(themeColorMeta) themeColorMeta.setAttribute("content","#000000");
    }
  }
  var saved=null;
  try{saved=localStorage.getItem("theme");}catch(e){}
  if(saved==="light"){
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
  if(themeBtn){
    themeBtn.addEventListener("click",function(e){
      var cur=root.getAttribute("data-theme")==="light"?"light":"dark";
      var next=cur==="light"?"dark":"light";

      if(!document.startViewTransition||matchMedia("(prefers-reduced-motion: reduce)").matches){
        applyTheme(next);
        try{localStorage.setItem("theme",next);}catch(err){}
        return;
      }

      var rect=themeBtn.getBoundingClientRect();
      var x=(e&&e.clientX)?e.clientX:(rect.left+rect.width/2);
      var y=(e&&e.clientY)?e.clientY:(rect.top+rect.height/2);
      var endRadius=Math.hypot(
        Math.max(x,window.innerWidth-x),
        Math.max(y,window.innerHeight-y)
      );

      var transition=document.startViewTransition(function(){
        applyTheme(next);
        try{localStorage.setItem("theme",next);}catch(err){}
      });

      transition.ready.then(function(){
        var clipPath=[
          "circle(0px at "+x+"px "+y+"px)",
          "circle("+endRadius+"px at "+x+"px "+y+"px)"
        ];
        document.documentElement.animate(
          { clipPath: clipPath },
          {
            duration: 550,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
    });
  }

  var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var h=document.querySelector("h1");
  if(!rm){h.setAttribute("aria-label",h.textContent);h.innerHTML=h.textContent.split(" ").map(function(w,i){return '<span class="w" aria-hidden="true"><span style="--i:'+i+'">'+w+'</span></span>';}).join(" ");}
  var gr=document.querySelector(".grid");
  if(!rm&&gr){
    var lastX=window.innerWidth*0.5;
    var lastY=window.innerHeight*0.3;
    var hasMoved=false;

    function updateGridPos(){
      var x = hasMoved ? (lastX + (window.scrollX||0)) : (window.innerWidth*0.5);
      var y = hasMoved ? (lastY + (window.scrollY||0)) : (window.innerHeight*0.3 + (window.scrollY||0));
      gr.style.setProperty("--mx", x + "px");
      gr.style.setProperty("--my", y + "px");
    }

    window.addEventListener("pointermove",function(e){
      hasMoved=true;
      lastX=e.clientX;
      lastY=e.clientY;
      updateGridPos();
    },{passive:true});

    window.addEventListener("scroll",updateGridPos,{passive:true});
    window.addEventListener("resize",updateGridPos,{passive:true});
    updateGridPos();
  }
  if(!rm&&"IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target);}});},{threshold:.15});
    document.querySelectorAll(".sec h2,.about p,.sub-title,.path li,.comp-card,.skills>div,.filters,.row,.mail,.social").forEach(function(t,k){t.classList.add("rv");t.style.setProperty("--d",(k%4)*70+"ms");io.observe(t);});
  }
  var chips=document.querySelectorAll(".chip"),rows=document.querySelectorAll(".row");
  chips.forEach(function(c){
    c.addEventListener("click",function(){
      var f=c.getAttribute("data-f");
      chips.forEach(function(x){x.setAttribute("aria-pressed",x===c?"true":"false");});
      rows.forEach(function(r){
        var show=f==="all"||f==="tutti"||r.getAttribute("data-tags").split(" ").indexOf(f)>-1;
        if(show){r.removeAttribute("hidden");r.classList.remove("pop");void r.offsetWidth;r.classList.add("pop");}else{r.setAttribute("hidden","");}
      });
    });
  });

  var compScroll=document.getElementById("comp-scroll");
  var prevBtn=document.getElementById("comp-prev");
  var nextBtn=document.getElementById("comp-next");
  var scrollControls=document.querySelector(".scroll-controls");
  if(compScroll){
    function getScrollStep(){
      var card=compScroll.querySelector(".comp-card");
      return card?(card.offsetWidth+22):340;
    }
    if(prevBtn){
      prevBtn.addEventListener("click",function(){
        compScroll.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
      });
    }
    if(nextBtn){
      nextBtn.addEventListener("click",function(){
        compScroll.scrollBy({ left: getScrollStep(), behavior: "smooth" });
      });
    }
    function updateControls(){
      if(!scrollControls) return;
      var hasOverflow=compScroll.scrollWidth>compScroll.clientWidth+6;
      scrollControls.style.display=hasOverflow?"flex":"none";
    }
    window.addEventListener("resize",updateControls);
    setTimeout(updateControls,150);
  }

  var header=document.querySelector("header");
  if(header){
    function updateHeader(){
      header.classList.toggle("scrolled",(window.scrollY||0)>20);
    }
    window.addEventListener("scroll",updateHeader,{passive:true});
    updateHeader();
  }

  var yearEl=document.getElementById("year");
  if(yearEl){
    yearEl.textContent=new Date().getFullYear();
  }
})();
