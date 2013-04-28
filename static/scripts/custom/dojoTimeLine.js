
define(['dojo/dom'           ,
        'dojo/dom-construct' ,
        'dojo/dom-style'     ,
        'dojo/dom-attr'      ,
        'dojo/dom-geometry'  ,
        'dojo/window'        ,
        'dojo/on'            
],
function(dom, 
         domConstruct, 
         domStyle, 
         domAttr, 
         domGeon, 
         Win, on){

        var dojoTimeLineObj = new Object();

        dojoTimeLineObj.yearList   = [];
        dojoTimeLineObj.monthList  = [];
        dojoTimeLineObj.dayList    = [];
        dojoTimeLineObj.nonSelectedStyle = "margin:1px 5px 0px 5px ;padding:10px ;background:oldlace; border-radius: 3px 3px 0 0 ;box-shadow: 2px 2px 3px #aaa;"
        setTimeLineDateVars();

        function setTimeLineDateVars(){
          dojoTimeLineObj.maxDate    = new Date();
          dojoTimeLineObj.minDate    = new Date('1900-01-01');

          var maxYearnew = new Date().getFullYear('1900') + 1;
          var yearLine   = new Date().getYear();

          for (var i=1900; i< maxYearnew ; i++){
            dojoTimeLineObj.yearList.push(i);
          }
          for (var i=1; i< 13 ; i++){
            dojoTimeLineObj.monthList.push(i);
          }
          for (var i=1; i< 31 ; i++){
            dojoTimeLineObj.dayList.push(i);
          }
          console.log(dojoTimeLineObj);
        }

        function setYearLine(){
          domConstruct.create('div',{id   : 'dojoTimeLineYearLine', 
                                    style : "position:relative;top:80%; height:2em; font-family:helvetica,sans-serif,tahoma,ubuntu;"},'dojoTimeLine','first');

          for (var i=0; i < dojoTimeLineObj.yearList.length; i++ ){

            var yearToInsert = 'dojoTimeLineYearLine_span_' + dojoTimeLineObj.yearList[i];
            domConstruct.create('span',
                                {id: yearToInsert, 
                                 style: dojoTimeLineObj.nonSelectedStyle
                                },
                                'dojoTimeLineYearLine',
                                'last'
                                );

            on(dom.byId(yearToInsert), 
               'mouseover', 
               function(e){ 
                  if(e.target != dojoTimeLineObj.selectedYear){
                    domStyle.set(e.target,{background:'pink'});
                  }
               }
            );

            on(dom.byId(yearToInsert), 
               'mouseout', 
               function(e){ 
                  if(e.target != dojoTimeLineObj.selectedYear){
                    domStyle.set(e.target,{background:'oldlace'});
                  }
               }
            );

            on(dom.byId(yearToInsert), 
               'click', 
               function(e){ 
                  if(dojoTimeLineObj.selectedYear){
                    if(e.target != dojoTimeLineObj.selectedYear){
                      domStyle.set(dojoTimeLineObj.selectedYear,{background:'oldlace'});
                    }
                  }
                  domStyle.set(e.target,{background:'lightblue'});
                  dojoTimeLineObj.selectedYear = e.target;
                  if( !dom.byId('selectedYearDiv')){
                  domConstruct.create('div',{id    : 'selectedYearDiv', 
                                             style : 'width:auto; overflow-x: auto; height: 1em; margin: 1px 0px 0px 1px; padding: 2px; background: lightblue; box-shadow: -1px 2px 3px #aaa; text-align: center; vertical-align: middle; position:relative; left: 0px; '},'dojoTimeLineYearLine','before');
                  }
                  dom.byId('selectedYearDiv').innerHTML = e.target.innerHTML;
               }
            );

            dom.byId(yearToInsert).innerHTML = dojoTimeLineObj.yearList[i];

          }
        }
        setYearLine();
});
