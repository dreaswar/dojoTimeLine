require([
    "dojo/_base/declare" , 
    'dojo/dom'           ,
    "dojo/dom-construct" , 
    "dojo/dom-class"     ,
    "dojo/ready"         , 
    "dojo/_base/window"  ,
    
    'dojo/dom-style'     ,
    'dojo/dom-attr'      ,
    'dojo/dom-geometry'  ,
    'dojo/window'        ,
    'dojo/on'            ,
    'dojo/query'         ,
    'dojo/_base/array'   ,
    'dojo/date'          ,

    'dojo/fx'            ,
    'dojo/_base/fx'      ,
    
    "dojo/_base/xhr"     ,
    "dojo/request"       ,
    "dojo/json"          ,
    
    "dijit/_WidgetBase"     ,
    "dijit/_TemplatedMixin" ,
    "dojox/layout/DragPane" ,
    
    "dojo/store/Memory",
    
    "dijit/registry",
    "dijit/Tooltip",

    "dojo/NodeList-data",
    "dojo/NodeList-traverse"
], 
function(declare, 
        dom, 
        domConstruct, 
        domClass, 
        ready, 
        win, 
        domStyle,
        domAttr,
        domGeom,
        Win,
        on,
        query,
        array,
        dojoDate,
        fx,
        baseFx,

        xhr    ,
        request,
        JSON   ,

        _WidgetBase,
        _TemplatedMixin,

        DragPane,
        Memory,
        
        registry,
        Tooltip ){

    declare("dojoTimeLineWidget", [_WidgetBase], {

      yearList         : [],

      monthList        : [],

      dayList          : [],

      yearNodeList     : [],

      verboseMonthList : ['January'   ,
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
                         ],
/*
      nonSelectedStyle : "margin        : 1px 5px 0px 5px ;\
                          padding       : 10px ;           \
                          background    : lightblue;       \
                          border        : 0px 1px 0px 1px; ",
*/

      setTimeLineDateVars: function (){
          this.maxDate    = new Date();
          this.minDate    = new Date('1900-01-01');

          var maxYearnew = new Date().getFullYear('1900') + 1;
          var yearLine   = new Date().getYear();

          for (var i=1900; i< maxYearnew ; i++){
            this.yearList.push(i);
          }
          for (var i=1; i< 13 ; i++){
            this.monthList.push(i);
          }
          for (var i=1; i< 31 ; i++){
            this.dayList.push(i);
          }
        },

/*
      setInactiveMonthStyle: function (){
                              array.forEach(query('.monthDiv'),
                                            function(div){ 
                                              domStyle.set(div,
                                                          {background   : 'lightgoldenrodyellow',
                                                            color       : 'black', 
                                                            display     : 'inline-block',
                                                            whiteSpace  : 'nowrap'
                                                          }
                                              )
                                            });
      },
*/

    setYearLine: function (){
                      console.log("Starting the setYearLine Function");

                      __self = this;

                      this.yearLineDragPane = domConstruct.create('div',
                                                    { id    : domAttr.get(this.domNode,'id')+"_yearLineDragPane",
                                                      class : "yearLineDragPane"
                                                    },
                                                    this.domNode,
                                                    'first');

                      this.yearLineDomNode = domConstruct.create('div',
                                                    { id    : domAttr.get(this.domNode,'id')+"_yearLine",
                                                      class : 'yearLineDomNode'
                                                    },
                                                    this.yearLineDragPane,
                                                    'after');

                      for (var i=0; i < this.yearList.length; i++ ){
                        var yearToInsert = domAttr.get(this.domNode,'id') + '_span_' + this.yearList[i];

                        var yearNode = domConstruct.create('span',
                                            {id    : yearToInsert, 
                                            class : 'yearLineSpan'
                                            },
                                            this.yearLineDomNode,
                                            'last'
                                            );
 
                        this.yearNodeList.push(yearNode);

                        yearNode.innerHTML = this.yearList[i];
                    }
                    this.__setBinders();
      },

      __setBinders: function(){

          for (var y=0; y< __self.yearNodeList.length; y++){
            on(dom.byId(__self.yearNodeList[y]), 
              'mouseover', 
              function(e){ 
                  if(e.target != __self.selectedYear){
                    if( !domClass.contains(e.target,'hasNoEvent')){
                      domStyle.set(e.target,{background:'pink'});
                    }
                  }
              }
            );

            on(dom.byId(__self.yearNodeList[y]), 
              'mouseout', 
              function(e){ 
                  if(e.target != __self.selectedYear){
                    if( !domClass.contains(e.target,'hasNoEvent')){
                      domStyle.set(e.target,{background:'lightblue'});
                    }
                  }
              }
            );
            
            on(dom.byId(__self.yearNodeList[y]),'click', __self.onYearNodeClick);
          }
      },

      animateOnDateSelect: function(e){

          var dateContainerCount     = query('.dateContainer').length;
          var closestDateContainer = query(e).closest('.dateContainer')[0];


          var notExpElem      = query(".dateContainer.isNotExpanded")[0];
          var wOfNonExpElem   = domGeom.position(notExpElem).w;
          var xOfNonExpElem   = domGeom.position(notExpElem).x;

          array.forEach(query('.chosenDate.isExpanded'), function(node){
            if (node != closestDateContainer) {
              domClass.remove(node, 'chosenDate');
              domClass.remove(node, 'isExpanded');
              domClass.add(node, 'isNotExpanded');
              baseFx.animateProperty({node       : node,
                                      properties : {width: wOfNonExpElem, background:"white", color:"#aaa"}, 
                                      duration   : 800
                          }).play();
            }
          });

          if(!domClass.contains(closestDateContainer,'isExpanded')){
            baseFx.animateProperty({node     : closestDateContainer,
                                  properties : {width: wOfNonExpElem*20 ,background  : "#ffc" , color:"#aaa"}, 
                                  duration   : 800
                            }).play();
            domClass.add(closestDateContainer,"chosenDate isExpanded");
            domClass.remove(closestDateContainer,"isNotExpanded");
          }
      },

      _fetchEventsOnLoad : function(url){
          // This will run on load after widget instantiation to fetch a list of events datewise from the server as JSON
          // This will then display the events on the calendar
        request(url).
        then(
          function(json){
            var jsondata    = JSON.parse(json);
            var all_events  = jsondata.all_events; 

            var date_array  = new Array();
            var year_array  = new Array();
            var month_array = new Array();
            var day_array   = new Array();
            var date_map    = new Object();

            __self.eventStore  = new Memory({data: all_events, idProperty: 'pk'});

            for(var x=0; x< all_events.length; x++){
              var e_pk       = all_events[x].pk; 
              var e_day      = all_events[x].event_day;
              var e_month    = all_events[x].event_month;
              var e_year     = all_events[x].event_year;

              var e_date_obj = new Date(e_year, e_month, e_day);
              date_array.push( e_date_obj );

              var storeItem     = __self.eventStore.get(e_pk);
              storeItem.dateObj = e_date_obj;
              __self.eventStore.put(storeItem);

            }

            console.log(__self.eventStore);

            for(var x=0; x< all_events.length; x++){
              array.forEach(query('.yearLineSpan'), 
                            function(yearSpan){
                              if(yearSpan.innerHTML == all_events[x].event_year){
                                  domClass.remove(yearSpan,'hasNoEvent');  
                                  domClass.add(yearSpan,'hasEvent');
                                  if (domStyle.get(yearSpan,'display') == 'none'){
                                    domStyle.set(yearSpan,'display','inline');
                                  }
                              }else{
                                if(! domClass.contains(yearSpan,'hasEvent') ){
                                  domClass.add(yearSpan,'hasNoEvent');
                                }
                              }
              });
            }
          }, 
          function(error){
            console.log("Error! Server is not accesible\nError Returned is: " + error);
          }
        );
      },
      
      _fetchEventsOnUpdate: function(){
        // This is called on a update on a data elsewhere so that the timeline updates itself
      },

      onYearNodeClick: function(e){
                          if(__self.selectedYear){
                            if(e.target != __self.selectedYear){
                              domStyle.set(__self.selectedYear,{background:'lightblue'});
                            }
                          }

                          domStyle.set(e.target,{background:'lightblue'});
                          __self.selectedYear          = e.target;
                          __self.selectedYear.year     = e.target.innerHTML;
                          __self.selectedYear.eventSet = __self.eventStore.query({event_year: e.target.innerHTML });
                          
                          if( !__self.selectedYearDomNode){
                            __self.selectedYearDomNode = domConstruct.create('div',
                                                                            { class : 'selectedYearDomNode'},
                                                                          __self.yearLineDomNode,
                                                                          'before');
                          }

                          domStyle.set(__self.yearLineDragPane,{display   : 'none'});
                          domStyle.set(__self.yearLineDomNode,{display   : 'none'});
                          domStyle.set(__self.domNode,{overflowX : 'hidden'});
                          domStyle.set(__self.selectedYearDomNode,{display:'block'});

                          __self.selectedYearDomNode.innerHTML = e.target.innerHTML;

                          var showYearLineDomNode = __self.showYearLineDomNode = domConstruct.create('img',
                                                                                                     {class:"showYearLineDomNode",
                                                                                                      src    : 'static/images/arrow_down.png',
                                                                                                      alt    : 'Show Years',
                                                                                                      },
                                                                                                  __self.selectedYearDomNode,
                                                                                                'last');

                          new Tooltip({connectId:[showYearLineDomNode], label: "Show Year Line selector"})

                          function createMonthListDiv(){
                              __self.monthListDivDomNode= domConstruct.create('div',{class: "monthListDivDomNode"},
                                                                              __self.selectedYearDomNode,
                                                                              'before');

                            var monthListHtml = '';

                            for(var i=1; i< __self.verboseMonthList.length; i++){
                              var month = __self.verboseMonthList[i-1];
                              var thisMonth = domConstruct.create('span',
                                                {id        : domAttr.get(__self.monthListDivDomNode,'id')+'_monthDiv_'+ month, 
                                                 class     : 'monthDiv monthHasNoEvent deSelectedMonth',
                                                 innerHTML : month
                                                },
                                                __self.monthListDivDomNode,
                                              'last');
                              new Tooltip({connectId:[thisMonth], label:"This month has no events"})
                           }

                          on(query('.monthDiv'),'click',__self.onMonthNodeClick);

                          }

                          if( !__self.monthListDivDomNode ){
                                createMonthListDiv();
                          }else{
                            domConstruct.destroy(__self.monthListDivDomNode);
                            createMonthListDiv();
                          }

                        function setEventMonthStyles(){

                          __self.selectedYear.eventSet.forEach( function(Y_event){

                            array.forEach(query('.monthDiv'), function(mDiv){
                              var monthIndex = (__self.verboseMonthList.indexOf(mDiv.innerHTML)+1)

                              if(Y_event.event_month ==  monthIndex) {
                                domClass.remove(mDiv,'monthHasNoEvent');
                                domClass.add(mDiv,'monthHasEvent');
                                new Tooltip({connectId:[mDiv], label: "This Month has events, Click to see more"});

                              }
                            });

                          });
                        }

                        setEventMonthStyles();
                        on( __self.showYearLineDomNode,'click',__self.onShowYearLineDomNodeClick);
    },

    onShowYearLineDomNodeClick: function(e){
                                    
                                    domStyle.set( __self.yearLineDragPane,
                                                  {display:'block'} 
                                    );                               
                                    domStyle.set( __self.yearLineDomNode,
                                                  {display:'inline-block'} 
                                    ); 
                                    /*
                                    domStyle.set( __self.yearLineDomNode,
                                                  {overflowX:'auto'} 
                                    );
                                    */
                                    domStyle.set( __self.selectedYearDomNode,
                                                  {display:'none'} 
                                    );
                                    domStyle.set( __self.monthListDivDomNode,
                                                  {display:'none'} 
                                    );
                                    domStyle.set( __self.dateContainerDomNode,
                                                  {display:'none'} 
                                    );
                                    domStyle.set( __self.chosenDateDomNode,
                                                  {display:'none'} 
                                    );
    },

      onMonthNodeClick: function(e){

                String.prototype.capitalize = function() {
                  return this.charAt(0).toUpperCase() + this.slice(1);
                }

                __self.selectedMonth            = e.target;
                __self.selectedMonth.month      = e.target.innerHTML;
                __self.selectedMonth.monthIndex = __self.verboseMonthList.indexOf(e.target.innerHTML)+1

                 //__self.setInactiveMonthStyle();

                __self.selectedMonth.eventSet = __self.eventStore.query({event_year  : __self.selectedYear.year,
                                                                         event_month : __self.verboseMonthList.indexOf(e.target.innerHTML)+1 
                                                                        });

                array.forEach(query('.selectedMonth'),function(node){
                  domClass.remove(node, 'selectedMonth');
                  domClass.add(node,'deSelectedMonth');
                });

                domClass.remove(e.target,'deSelectedMonth');
                domClass.add(e.target,'selectedMonth');

                var year  = __self.selectedYear.innerHTML;
                var month = array.indexOf(__self.verboseMonthList, 
                                          __self.selectedMonth.innerHTML.capitalize()
                                          );
                year  = Number(year);
                month = Number(month)
                var daysInMonth = dojoDate.getDaysInMonth(new Date(year,month,1));

                __self.year = year;
                __self.month = month;

                if(__self.dateContainerDomNode){
                  domConstruct.destroy(__self.dateContainerDomNode);
                }
                __self.dateContainerDomNode = domConstruct.create('div',{class: "dateContainerDomNode"},
                                                                __self.domNode,
                                                                0
                                              );

                for(var i=1; i <= Number(daysInMonth); i++){
                  var thisDateContainer = domConstruct.create('div',
                                                              {id        : domAttr.get(__self.domNode,'id')+'_dateContainer_'+i,
                                                              class      : 'dateContainer isNotExpanded',
                                                              innerHTML  : i
                                                              },
                                                              __self.dateContainerDomNode,
                                                              'last'
                                          );

                  var dayEvent = __self.eventStore.query({event_year  : __self.selectedYear.year, 
                                                          event_month : __self.selectedMonth.monthIndex,
                                                          event_day   : i
                                                        });

                  console.log(dayEvent);

                  if(dayEvent.length>=1){
                    console.log("Day event is true: ");
                    console.log(dayEvent);

                    domClass.add(thisDateContainer, 'dayHasEvent');
                    domClass.remove(thisDateContainer, 'dayHasNoEvent');
                    domStyle.set(thisDateContainer, {background:"#EEE", width:"1.5em"});

                    for(var dayEvt=0; dayEvt<dayEvent.length; dayEvt++){
                      var thisEventIndicator = domConstruct.create('img',
                                                                  {class      : "dateEventIndicator",
                                                                  src        : "./static/images/green-icon.png"
                                                                  },
                                                                  thisDateContainer,
                                                                  'last'
                                              );

                      var formattedEventHTML = "<hr>\n <b>"+ dayEvent[dayEvt].event_date + "</b><hr>\n<br>"  + "Title: \t"  + dayEvent[dayEvt].title + "<br>\nDescription: \t" + dayEvent[dayEvt].description;
                      new Tooltip({connectId:[thisEventIndicator],label: formattedEventHTML });
                    }
                    new Tooltip({connectId:[thisDateContainer],label: "This Day has " + dayEvent.length + " event\s" });
                  }else{
                    domClass.add(thisDateContainer, 'dayHasNoEvent');
                    domClass.remove(thisDateContainer, 'dayHasEvent');
                    new Tooltip({connectId:[thisDateContainer],label: "No Events for this Date"});
                  }
                  on(query('.dateContainer'), 'click', __self.onDateNodeClick );
                }
      },

      onDateNodeClick: function(e){
                    var day          = Number(e.target.innerHTML);
                    __self.selectedDay = e.target;
                    __self.day         = day;

                    array.forEach(query('.dateContainer'),
                                  function(div){
                                    domStyle.set(div,{background:'white'});
                                  });

                    domStyle.set(e.target,{background:'#ffe'});

                    __self.animateOnDateSelect(e.target);

                    __self._fetchEventsOnLoad("/dojotimeline/get_events");
/*
                    var chosenDate = new Date(__self.year, __self.month,__self.day);
                    __self.date      = chosenDate;

                    if(!__self.chosenDateDomNode){
                        __self.chosenDateDomNode = domConstruct.create('div',
                                                                      {innerHTML : chosenDate,
                                                                       class     : 'chosenDate'
                                                                      },
                                                                      __self.domNode,
                                                                      'after'
                                                    );
                    }else{
                        __self.chosenDateDomNode.innerHTML = chosenDate;
                    }
*/
    },

    buildRendering : function(){
          this.domNode  = domConstruct.create('div', {id    : "dojoTimeLineWidget",
                                                      class : "dojoTimeLineWidget",
                                                      style : domStyle.get(dom.byId("dojoTimeLineWidgetContainer"),'style')
                                                    });
          this.setTimeLineDateVars();
          this.setYearLine();
          this.inherited(arguments);
    },

    postCreate    : function(){
      // Binding the events and more DOMS to create ..
        this._fetchEventsOnLoad("/dojotimeline/get_events");
        this.inherited(arguments);        
    }

  });

  ready(function(){
      // Create the widget programmatically and place in DOM
      (new dojoTimeLineWidget()).placeAt(dom.byId('dojoTimeLineWidgetContainer'));
  });

});
