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
    
    "dojo/store/Memory"

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
         Memory){

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

      nonSelectedStyle : "margin        : 1px 5px 0px 5px ;\
                          padding       : 10px ;           \
                          background    : lightblue;       \
                          border        : 0px 1px 0px 1px; ",

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

      setYearLine: function (){
                      console.log("Starting the setYearLine Function");

                      __self = this;

                      this.yearLineDragPane = domConstruct.create('div',
                                                    { id    : domAttr.get(this.domNode,'id')+"_yearLineDragPane",
                                                      style : "position     : absolute; \
                                                              top           : 85%;      \
                                                              height        : 1em;      \
                                                              font-family   : Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                                              display       : inline-block; \
                                                              white-space   : nowrap;       \
                                                              overflow-x    : hidden;       \
                                                              overflow-y    : hidden;       \
                                                              background    : lightblue;    \
                                                              box-shadow    : 0px 2px 2px #aaa;\
                                                              opacity       : 0.85;            \
                                                              margin-bottom : 5px;             \
                                                              "
                                                    },
                                                    this.domNode,
                                                    'first');

                      this.yearLineDomNode = domConstruct.create('div',
                                                    { id    : domAttr.get(this.domNode,'id')+"_yearLine",
                                                      style : "position   : absolute; \
                                                              top        : 85%;       \
                                                              height     : 1em;       \
                                                              font-family: Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                                              display    : inline-block;    \
                                                              background : lightblue;       \
                                                              box-shadow : 0px 2px 2px #aaa;\
                                                              opacity    : 0.85;            \
                                                              margin-bottom: 5px;           \
                                                              "
                                                    },
                                                    this.yearLineDragPane,
                                                    'after');

                      for (var i=0; i < this.yearList.length; i++ ){
                        var yearToInsert = domAttr.get(this.domNode,'id') + '_span_' + this.yearList[i];

                        var yearNode = domConstruct.create('span',
                                            {id    : yearToInsert, 
                                            class : 'dojoTimeLineYearLineSpan',
                                            style : this.nonSelectedStyle
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

        var currentContainerNumber;

        var divsBefore = [];
        var divsAfter  = [];

        function xOfDateContainer(x){
          return domGeom.position(dom.byId('dateContainer_'+x)).x;
        }

        var wOfe   = domGeom.position(e).w;
        var xOfe   = domGeom.position(e).x;

        var xOfDojoTimeLine   = domGeom.position(__self.domNode).x;
        var hOfDojoTimeLine   = domGeom.position(__self.domNode).h;      
        var wOfDojoTimeLine   = domGeom.position(__self.domNode).w;

        var hOfselectedYear  = domGeom.position(__self.selectedYearDomNode).w;
        var hOfselectedYear  = domGeom.position(__self.selectedYearDomNode).h;

        array.forEach(query('.chosenDate'), function(node){
          if (node != e) {
            domClass.remove(node, 'chosenDate');
            baseFx.animateProperty({node       : node,
                                    properties : {width: wOfe, background:"white", color:"#aaa"}, 
                                    duration   : 800
                        }).play();
          }
        });
        domClass.add(e,'chosenDate');
        baseFx.animateProperty({node     : e,
                              properties : {width: wOfe*20 ,background  : "#ffc" , color:"#aaa"}, 
                              duration   : 800
                        }).play();
    },

    _dummyEvents     : [{ date         : new Date(1,12,2012)    ,
                             title        : "First Event"          ,
                             description  : "What an Inauguration" ,
                             absoluteUrl  : "/"
                        },
                        { date         : new Date(1,01,2013)       ,
                             title        : "Second Event"             ,
                             description  : "This is the second event" ,
                             absoluteUrl  : "/"
                        },
                        { date         : new Date(1,02,2013)    ,
                             title        : "Watch !"          ,
                             description  : "Bought a Fossil watch" ,
                             absoluteUrl  : "/"
                        },
                        { date         : new Date(3,01,2013)    ,
                             title        : "Twitter handle !"          ,
                             description  : "Got a twitter handle" ,
                             absoluteUrl  : "/"
                        },
                        { date         : new Date(3,12,2012)    ,
                             title        : "Bought a House !"          ,
                             description  : "What an Inauguration" ,
                             absoluteUrl  : "/"
                        }
    ],

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

          var eventStore  = new Memory({data: [all_events], idProperty: 'event_date'});
          console.log(eventStore);

          for(var x=0; x< all_events.length; x++){
             date_array.push( all_events[x].event_date );
          }

          for(var x=0; x< all_events.length; x++){
            array.forEach(query('.dojoTimeLineYearLineSpan'), 
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
          /*
          domConstruct.create('div',
                              {innerHTML : date_array, 
                               style     : "position   : relative; \
                                            top        : 100px   ; \
                                            left       : 20px    ; \
                                            border     : solid 1px lightblue; \
                                            background : lightgoldenrodyellow;\
                                            max-width  : 80%;                 \
                                           "
                              }, 
                              dom.byId('addEventFormDiv'), 
                              'after');
          */
        }, 
        function(error){
          console.log("Error! Server is not accesible\nError Returned is: " + error);
        }
      );
    },
    
    _fetchEventsOnUpdate: function(){
      // This is called on a update on a data elsewhere so that the timeline updates itself
    },
    
    onMonthNodeClick: function(e){

                  String.prototype.capitalize = function() {
                    return this.charAt(0).toUpperCase() + this.slice(1);
                  }

                __self.selectedMonth = e.target;

                __self.setInactiveMonthStyle();
                domStyle.set( dom.byId(e.target),{background:'navy',color: 'white'});

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
                __self.dateContainerDomNode = domConstruct.create('div',
                                                                {style : "height         : 12em;           \
                                                                          position       : relative;       \
                                                                          top            : 0px;            \
                                                                          text-align     : center;         \
                                                                          vertical-align : middle;         \
                                                                          display        : block;          \
                                                                          overflow-x     : auto;           \
                                                                          overflow-y     : hidden;         \
                                                                          margin         : 0 0 -12em 0;  \
                                                                          white-space    : nowrap  ;       \
                                                                          background     : white   ;       \
                                                                          "
                                                                },
                                                                __self.domNode,
                                                                0
                                              );
//                 console.log("Created a single dateContainer");

//                 console.log("About to Create all the individual Date Containers..");
                for(var i=1; i <= Number(daysInMonth); i++){
                  domConstruct.create('div',
                                    {id        : domAttr.get(__self.domNode,'id')+'_dateContainer_'+i,
                                    class      : 'dateContainer',
                                    innerHTML  : i,
                                    style      : "height         : 20em;              \
                                                  width          : 1.2em;            \
                                                  border-right   : solid 1px #ddd;   \
                                                  margin         : 0px -2px 0px 2px; \
                                                  padding        : 5.19em 2px 1.1em 2px;\
                                                  font-family    : Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                                  font-size      : 1em;              \
                                                  color          : #aaa;             \
                                                  display        : inline-block;     \
                                                  white-space    : nowrap;           \
                                                  position       : relative;         \
                                                  top            : -2px;              \
                                                  overflow-x     : auto;             \
                                                  "
                                    },
                                    __self.dateContainerDomNode,
                                    'last'
                  );
                  on(query('.dateContainer'), 'click', __self.onDateNodeClick );
//                   console.log("Bound the event on dateContainer");
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
                    
//                     console.log("About to Bind the Animation to date selectors...");
                    __self.animateOnDateSelect(e.target);
                    
                    __self._fetchEventsOnLoad("/dojotimeline/get_events");

                    var chosenDate = new Date(__self.year, __self.month,__self.day);
                    __self.date      = chosenDate;

                    if(!__self.chosenDateDomNode){
                        __self.chosenDateDomNode = domConstruct.create('div',
                                                                      {innerHTML : chosenDate,
                                                                      style     : 'margin      : 1px;       \
                                                                                  width       : 500px;      \
                                                                                  position    : relative;  \
                                                                                  top         : 10px;       \
                                                                                  left        : 0em;       \
                                                                                  font-family : Helvetica,Sans-serif,Tahoma,Ubuntu;\
                                                                                  font-size   : 12px;                              \
                                                                                  color       : #aaa;                              \
                                                                                  display     : none;                      \
                                                                                  '
                                                                      },
                                                                      __self.domNode,
                                                                      'after'
                                                    );
                    }else{
                        __self.chosenDateDomNode.innerHTML = chosenDate;
                    }
      },

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

      onYearNodeClick: function(e){
//                           console.log(__self);
                          if(__self.selectedYear){
//                             console.log("Selected Year has been set already");
                            if(e.target != __self.selectedYear){
                              domStyle.set(__self.selectedYear,{background:'lightblue'});
                            }
                          }

//                           console.log("Trying to set clicked target to lightblue");
                          domStyle.set(e.target,{background:'lightblue'});
                          __self.selectedYear = e.target;

                          if( !__self.selectedYearDomNode){
                            //var timeLineWidth = this.domNode.scrollWidth.toString()+"px";
//                             console.log("There is no selectedYearDomNode so far.. creating one..");
                            __self.selectedYearDomNode = domConstruct.create('div',
                                                                            { style : "white-space    : nowrap;           \
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
                                                                                      top            : 80%;              \
                                                                                      opacity        : 0.7;              \
                                                                                      left           : 0px; "
                                                                          },
                                                                          __self.yearLineDomNode,
                                                                          'before');
                          }

//                           console.log("Trying to set Cascading changes in style to yearLineDomNode, domNode, and selectedYearDomNode");
//                           console.log(__self);
//                           console.log(__self.selectedYearDomNode);
//                           console.log(__self.yearLineDomNode);
//                           console.log(__self.domNode);

                          domStyle.set(__self.yearLineDragPane,{display   : 'none'});
                          domStyle.set(__self.yearLineDomNode,{display   : 'none'});
                          domStyle.set(__self.domNode,{overflowX : 'hidden'});
                          domStyle.set(__self.selectedYearDomNode,{width: "99.4%",overflow:'hidden',display:'block'});
//                           console.log("Cascading changes in style to yearLineDomNode, domNode, and selectedYearDomNode set..");

                          __self.selectedYearDomNode.innerHTML = e.target.innerHTML;

                          __self.showYearLineDomNode = domConstruct.create('img',{src    : 'static/images/arrow_down.png',
                                                                                width  : '12px', 
                                                                                alt    : 'Show Years',
                                                                                title  : 'Show Years',
                                                                                height : '12px',
                                                                                margin : '2px'
                                                                                },
                                                                            __self.selectedYearDomNode,
                                                                          'last');

//                           __self.setInactiveMonthStyle();

                          if( !__self.monthListDivDomNode ){

                            __self.monthListDivDomNode= domConstruct.create('div',
                                                                          {style : "height          : 0.9em;             \
                                                                                    margin          : 1px 0px 1px 0px;   \
                                                                                    padding         : 0px 0px 6px 0px;   \
                                                                                    background      : lightgoldenrodyellow;\
                                                                                    box-shadow      : -1px 2px 3px #aaa; \
                                                                                    text-align      : center;            \
                                                                                    vertical-align  : middle;            \
                                                                                    position        : relative;          \
                                                                                    top             : 80%;               \
                                                                                    white-space     : nowrap;            \
                                                                                    opacity         : .7 ;               \
                                                                                    display         : inline-block       \
                                                                                    overflow-x      : auto;              \
                                                                                    overflow-y      : hidden;            \
                                                                                    left            : 0px; "
                                                                          },
                                                                          __self.selectedYearDomNode,
                                                                        'before');

                            var monthListHtml = '';

                            for(var i=0; i< __self.verboseMonthList.length; i++){
                              var month = __self.verboseMonthList[i];
                              domConstruct.create('span',
                                                {id    : domAttr.get(__self.monthListDivDomNode,'id')+'_monthDiv_'+ month, 
                                                  class : 'monthDiv',
                                                  style : "margin         : 0px 5px 0px 5px; \
                                                          padding        : 1px;             \
                                                          text-align     : center;          \
                                                          vertical-align : middle;          \
                                                          font-family    : Helvetica,sans-serif, Tahoma, Ubuntu; \
                                                          font-size      : 10px;",
                                                innerHTML : month
                                                },
                                                __self.monthListDivDomNode,
                                              'last');
                            }

//                             console.log("About to Bind the event on monthDiv click");
                            on(query('.monthDiv'),'click',__self.onMonthNodeClick);
                          }else{
                            domStyle.set(__self.monthListDivDomNode,{display:'block'});
                            __self.setInactiveMonthStyle();
                          }


                          on( __self.showYearLineDomNode,'click',__self.onShowYearLineDomNodeClick);
//                           console.log("Bound the event on showYearLineDomNode click..");
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
    
    buildRendering : function(){
          this.domNode  = domConstruct.create('div', {id    : "dojoTimeLineWidget",
                                                      class : "dojoTimeLineWidget",
                                                      style : domStyle.get(dom.byId("dojoTimeLineWidgetContainer"),'style')
                                                    });
//        this.dragPane  = new DragPane({id: 'dojoTimeLineWidget'},'dojoTimeLineWidget');
//        this.dragPane.startup();
          this.setTimeLineDateVars();
          this.setYearLine();
          this.inherited(arguments);
//        console.log("Completed the Rendering");
    },

    postCreate    : function(){
      // Binding the events and more DOMS to create ..
//      console.log(this.yearNodeList);
//      console.log(this.yearNodeList.length);
        this._fetchEventsOnLoad("/dojotimeline/get_events");
        this.inherited(arguments);        
//      console.log("Completed the PostCreate");
    }

  });

  ready(function(){
      // Create the widget programmatically and place in DOM
      (new dojoTimeLineWidget()).placeAt(dom.byId('dojoTimeLineWidgetContainer'));
  });

});
