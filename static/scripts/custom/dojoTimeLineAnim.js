
function animateOnSelectDate(e){

  require(['dojo/fx'           ,
         'dojo/dom'          ,
         'dojo/dom-construct',
         'dojo/dom-style'    ,
         'dojo/dom-attr'     ,
         'dojo/dom-geometry' ,
         'dojo/_base/fx'     ,
         'dojo/query'        ,
         'dojo/on'            
        ],

  function(fx,dom,domConstruct, domStyle, domAttr, domGeom, baseFx, query,on){


    var dateContainerCount     = query('.dateContainer').length;
    var currentContainerNumber = 14;
    
    var divsBefore = [];
    var divsAfter  = [];

    function xOfDateContainer(x){
      return domGeom.position(dom.byId('dateContainer_'+x)).x;
    }

    var xOfDojoTimeLine   = domGeom.position(dom.byId('dojoTimeLine')).x;
    var hOfDojoTimeLine   = domGeom.position(dom.byId('dojoTimeLine')).h;      
    var wOfDojoTimeLine   = domGeom.position(dom.byId('dojoTimeLine')).w;

    var hOfselectedYear  = domGeom.position(dom.byId('selectedYearDiv')).w;
    var hOfselectedYear  = domGeom.position(dom.byId('selectedYearDiv')).h;


    domConstruct.create('div',
                        {id        : 'selectedDateDiv', 
                        innerHTML :  e.innerHTML,
                        style     : 'background  : #FEDEDE; \
                                     z-index     : 10000;   \
                                     height      : 10em;    \
                                     overflow-x  : hidden;  \
                                     overflow-y  : hidden;  \
                                     font-family : Helvetica,Sans-serif,Tahoma,Ubuntu\
                                    '
                        },
                        'dateContainer',
                        'before');

    baseFx.animateProperty({node       : dom.byId('selectedDateDiv'),
                            properties : {left   : {start : domGeom.position(e).x, 
                                                    end   : xOfDojoTimeLine
                                                    },
                                          width  : {start : domGeom.position(e).w, 
                                                    end   : wOfDojoTimeLine
                                                    },
                                          height: {start : domGeom.position(e).h, 
                                                    end   : hOfDojoTimeLine
                                                  }
                                          }, 
                            duration   : 800
                          }).play();

    on(dom.byId('selectedDateDiv'),
        'click',
        function(e){
          baseFx.animateProperty({node       : e.target,
                                  properties : {left   : domGeom.position(e.target).x,
                                                width  : {start : domGeom.position(e.target).w, 
                                                          end   : 10
                                                          },
                                                opacity: {start: 1, end:0.1}
                                                }, 
                            duration   : 800
                          }).play();
          domConstruct.destroy('selectedDateDiv');
        }
    );



  /*   
    for (var i = 1; i<=currentContainerNumber; i++){
      divsBefore.push(dom.byId('dateContainer_'+i));
      baseFx.animateProperty({node       : dom.byId('dateContainer_'+i),
                            properties : {left   : -(xOfDateContainer(i)-xOfDojoTimeLine)}, 
                            duration   : 800
                      }).play();
    }


    baseFx.animateProperty({node       : dom.byId('dateContainer_14'),
                            properties : {left   : -(xOfDateContainer(14)-xOfDojoTimeLine)}, 
                            duration   : 800
                      }).play();



    var xB = xOfDateContainer(15);

    baseFx.animateProperty({node       : dom.byId('dateContainer_14'),
                        properties : {width   : {start: 100,end: dojoTimeLineWidth}}, 
                        duration   : 800
                  }).play();

    var xA = xOfDateContainer(15);
    var xD = (xB-xA)-(xOfDateContainer(14)-xOfDojoTimeLine);
    

    for (var i = 15; i<=dateContainerCount; i++){
      divsAfter.push(dom.byId('dateContainer_'+i));
      baseFx.animateProperty({node       : dom.byId('dateContainer_'+i),
                            properties : {left   : xD}, 
                            duration   : 800
                      }).play();
    }

  */


  });
}