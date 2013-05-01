
define(['dojo/dom'           ,
        'dojo/dom-construct' ,
        'dojo/dom-style'     ,
        'dojo/dom-attr'      ,
        'dojo/dom-geometry'  ,
        'dojo/window'        ,
        'dojo/on'            ,
        'dojo/query'         ,
        'dojo/_base/array'   ,
        'dojo/date'          ,
        'dojoTimeLine/dojoTimeLineAnim'
],
function(dom, 
         domConstruct, 
         domStyle, 
         domAttr, 
         domGeom, 
         Win, 
         on,
         query,
         array,
         dojoDate){

        String.prototype.capitalize = function() {
          return this.charAt(0).toUpperCase() + this.slice(1);
        }
  
        var dojoTimeLineObj = new Object();

        dojoTimeLineObj.yearList   = [];
        dojoTimeLineObj.monthList  = [];
        dojoTimeLineObj.verboseMonthList = ['January'   ,
                                            'February'  ,
                                            'March'     ,
                                            'April'     ,
                                            'May'       ,
                                            'June'      ,
                                            'July'      ,
                                            'August'    ,
                                            'September' ,
                                            'October'   ,
                                            'November'  ,
                                            'December'
                                          ]
        dojoTimeLineObj.dayList    = [];
        dojoTimeLineObj.nonSelectedStyle = "margin        : 1px 5px 0px 5px ;\
                                            padding       : 10px ;           \
                                            background    : lightblue;       \
                                            border        : 0px 1px 0px 1px; "
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
          domConstruct.create('div',
                              {id    : 'dojoTimeLineYearLine', 
                               style : "position   : absolute;\
                                        top        : 80%;     \
                                        height     : 2em;     \
                                        font-family: Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                        display    : inline-block; \
                                        white-space: nowrap;       \
                                        overflow-x : auto;         \
                                        overflow-y : hidden;       \
                                        "
                              },
                              'dojoTimeLine','first');

          for (var i=0; i < dojoTimeLineObj.yearList.length; i++ ){

            var yearToInsert = 'dojoTimeLineYearLine_span_' + dojoTimeLineObj.yearList[i];
            domConstruct.create('span',
                                {id: yearToInsert, 
                                class : 'dojoTimeLineYearLineSpan',
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
                    domStyle.set(e.target,{background:'lightblue'});
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
                    var timeLineWidth = dom.byId('dojoTimeLine').scrollWidth.toString()+"px";
                    console.log(timeLineWidth);
                    domConstruct.create('div',
                                        {id    : 'selectedYearDiv', 
                                         style : "white-space    : nowrap;           \
                                                  overflow-x     : auto;             \
                                                  overflow-y     : hidden;           \
                                                  display        : inline-block      \
                                                  height         : 1em;              \
                                                  margin         : 1px 0px 3px 1px;  \
                                                  padding        : 2px;              \
                                                  background     : lightblue;        \
                                                  box-shadow     : -1px 2px 3px #aaa;\
                                                  text-align     : center;           \
                                                  vertical-align : middle;           \
                                                  position       : relative;         \
                                                  top            : 75%;              \
                                                  opacity        : 0.7;              \
                                                  left           : 0px; "
                                        },
                                       'dojoTimeLineYearLine','before');
                  }


                  domStyle.set('dojoTimeLineYearLine',{display:'none'});
                  domStyle.set('selectedYearDiv',{width: "99.4%",overflow:'hidden',display:'block'});

                  dom.byId('selectedYearDiv').innerHTML = e.target.innerHTML;
                  domConstruct.create('img',{src    : 'static/images/arrow_down.png',
                                             width  : '12px', 
                                             alt    : 'Show Years',
                                             title  : 'Show Years',
                                             height : '12px',
                                             margin : '2px',
                                             id      : 'showYearLine'
                                            },
                                      'selectedYearDiv',
                                      'last');                  


                  if( !dom.byId('monthListDiv') ){

                    domConstruct.create('div',
                                        {id    : 'monthListDiv', 
                                         style : "height          : 0.9em;             \
                                                  margin          : 1px 0px 1px 0px;   \
                                                  padding         : 1px;               \
                                                  background      : lightblue;         \
                                                  box-shadow      : -1px 2px 3px #aaa; \
                                                  text-align      : center;            \
                                                  vertical-align  : middle;            \
                                                  position        : relative;          \
                                                  top             : 72%;               \
                                                  white-space     : nowrap;            \
                                                  opacity         : .7 ;               \
                                                  display         : inline-block       \
                                                  overflow-x      : auto;              \
                                                  overflow-y      : hidden;            \
                                                  left            : 0px; "
                                        },
                                       'selectedYearDiv',
                                       'before');

                    var monthListHtml = '';

                    for(var i=0; i< dojoTimeLineObj.verboseMonthList.length; i++){
                      var month =dojoTimeLineObj.verboseMonthList[i];
                      domConstruct.create('span',
                                        {id    : 'monthDiv_'+ month, 
                                         class : 'monthDiv',
                                         style : "margin         : 0px 5px 0px 5px; \
                                                  padding        : 1px;             \
                                                  text-align     : center;          \
                                                  vertical-align : middle;          \
                                                  font-family    : Helvetica,sans-serif, Tahoma, Ubuntu; \
                                                  font-size      : 10px;",
                                         innerHTML : month
                                        },
                                       'monthListDiv',
                                       'last');
                    }

                    function setInactiveMonthStyle(){
                      array.forEach(query('.monthDiv'),
                                        function(div){ 
                                          domStyle.set(div,
                                                       {background  : 'lightblue',
                                                        color       : 'black', 
                                                        display     : 'inline-block',
                                                        whiteSpace  : 'nowrap'
                                                      }
                                          )
                                        });
                    }

                    on(query('.monthDiv'),
                       'click',
                       function(e){
                        dojoTimeLineObj.selectedMonth = e.target;

                        setInactiveMonthStyle();
                        domStyle.set( dom.byId(e.target),{background:'navy',color: 'white'});

                        var year  = dojoTimeLineObj.selectedYear.innerHTML;
                        var month = array.indexOf(dojoTimeLineObj.verboseMonthList, 
                                                   dojoTimeLineObj.selectedMonth.innerHTML.capitalize()
                                                  );
                        year  = Number(year);
                        month = Number(month)
                        var daysInMonth = dojoDate.getDaysInMonth(new Date(year,month,1));

                        dojoTimeLineObj.year = year;
                        dojoTimeLineObj.month = month;

                        if(dom.byId('dateContainer')){
                          domConstruct.destroy('dateContainer');
                        }
                        domConstruct.create('div',
                                          {id    : 'dateContainer',
                                           style : "height         : 10em;           \
                                                    position       : relative;       \
                                                    top            : 0px;            \
                                                    text-align     : center;         \
                                                    vertical-align : middle;         \
                                                    display        : block;          \
                                                    overflow-x     : auto;           \
                                                    overflow-y     : hidden;         \
                                                    margin         : 0 0 -10.8em 0;  \
                                                    white-space    : nowrap  ;       \
                                                    background     : white   ;       \
                                                    "
                                          },
                                          'dojoTimeLine',
                                          0
                        );

                        for(var i=1; i <= Number(daysInMonth); i++){
                          domConstruct.create('div',
                                            {id        : 'dateContainer_'+i,
                                            class      : 'dateContainer',
                                            innerHTML  : i,
                                            style      : "height         : 8em;              \
                                                          width          : 1.2em;            \
                                                          border-right   : solid 1px #ddd;   \
                                                          margin         : 0px -2px 0px 2px; \
                                                          padding        : 5.35em 2px 1.1em 2px;\
                                                          font-family    : Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                                          font-size      : 1em;              \
                                                          color          : #aaa;             \
                                                          display        : inline-block;     \
                                                          white-space    : nowrap;           \
                                                          position       : relative;         \
                                                          top            : 0px;              \
                                                          overflow-x     : auto;             \
                                                          "
                                            },
                                            'dateContainer',
                                            'last'
                          );

                          on(query('.dateContainer'), 
                             'click', 
                             function(e){

                               var day             = Number(e.target.innerHTML);
                               dojoTimeLineObj.selectedDay = e.target;
                               dojoTimeLineObj.day = day;

                               array.forEach(query('.dateContainer'),
                                             function(div){
                                               domStyle.set(div,{background:'white'});
                                            });

                               domStyle.set(e.target,{background:'#FEDEDE'});

                               animateOnSelectDate(e.target);

                               var chosenDate       = new Date(dojoTimeLineObj.year, dojoTimeLineObj.month,dojoTimeLineObj.day);
                               dojoTimeLineObj.date = chosenDate;

                               if(!dom.byId('chosenDate')){
                                  domConstruct.create('div',
                                                    {id       : 'chosenDate',
                                                    innerHTML : chosenDate,
                                                    style     : 'margin      : 5px;       \
                                                                 width       : 40em;      \
                                                                 position    : relative;  \
                                                                 top         : -2em;       \
                                                                 left        : 2em;       \
                                                                 font-family : Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                                                 font-size   : 12px;                              \
                                                                 color       : navy;                              \
                                                                 display     : block;                             \
                                                                '
                                                    },
                                                    'dojoTimeLine',
                                                    'after'
                                  );
                               }else{
                                  dom.byId('chosenDate').innerHTML = chosenDate;
                               }
                             }
                          );

                        }
                      }
                    );
                  }else{
                    domStyle.set(dom.byId('monthListDiv'),{display:'block'});
                    setInactiveMonthStyle();
                  }


                  on( dom.byId('showYearLine'),
                      'click',
                      function(e){ 
                            domStyle.set(dom.byId('dojoTimeLineYearLine'),{display:'block'}); 
                            domStyle.set(dom.byId('selectedYearDiv'),{display:'none'});
                            domStyle.set(dom.byId('monthListDiv'),{display:'none'});
                            domStyle.set(dom.byId('dateContainer'),{display:'none'});
                            domStyle.set(dom.byId('chosenDate'),{display:'none'});
                     }
                  );

               }
            );

            dom.byId(yearToInsert).innerHTML = dojoTimeLineObj.yearList[i];

          }
        }
        setYearLine();
});
