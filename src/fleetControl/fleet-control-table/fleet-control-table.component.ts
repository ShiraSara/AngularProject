import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject, BehaviorSubject, timer } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { filter, debounce, auditTime, map } from 'rxjs/operators';
import { auditImmediateTime } from 'src/app/helpers/auditImmediateOperator';
import { environment } from 'src/environments/environment';
import { ThrowStmt } from '@angular/compiler';
import { FleetControlService } from '../fleet-control.service';
import { DataTablesGlobal } from 'src/app/helpers/dataTablesGlobal';
import { TableModalComponent } from 'src/app/shared/table-modal/table-modal.component';
import { TripStatus, reqStatus } from 'src/app/models/enums';
import { timingSafeEqual } from 'crypto';

import { EBADF } from 'constants';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead';

import { ApiReponse } from 'src/app/models/apiResponse';
import { TripLocation } from 'src/app/models/TripLocation';
import Swal from 'sweetalert2';
import { FleetControlMobileDetailsComponent } from '../mobile/fleet-control-mobile-details/fleet-control-mobile-details.component';
import { TripState } from 'src/app/models/tripState';


interface dtOpt extends DataTables.Settings { buttons?: any }

@Component({
  selector: 'app-fleet-control-table',
  templateUrl: './fleet-control-table.component.html',
  styleUrls: ['./fleet-control-table.component.scss'],
  
})
export class FleetControlTableComponent implements OnInit {
  dtOptions: dtOpt = {};
  // dtTrigger: Subject<any> = new Subject();


  trips$ = new BehaviorSubject<Trip[]>(undefined);
  @Input('route') route:string 
  
  @Input('trips') set trips(trips: Trip[]) { 
    if(this.route && trips)
    {
      if(this.route=="בסיכון")
{
    var tri = trips.filter(r => r.state&&r.state.ToChange)
}
    else
    {
    var tri = trips.filter(r => r.Route == this.route)
    }
    this.trips$.next(tri && tri.length ? [...tri] : [null])
    }
    else
    this.trips$.next( [null])
    //this.trips$.next(trips); 
  };
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('tripsTable', { static: true }) tableElement: HTMLTableElement;
 
 
  private firstScroll = false;
  //private filterFn = (x:Trip) => { return x.IsrData && (this.showSpm || !x.IsrData.SPM); }
  private firstDraw = false;
 
  public load: boolean
  constructor(private service: FleetControlService, private modalService: NgbModal) { }

  ngOnInit() {
 
    /*$.fn.dataTable.ext.errMode = ( settings, techNote, message ) => {
      console.log(message);
    }*/
    ($.fn.dataTable.Api as any).register('column().title()', function (html) {
      var colheader = this.header();
      if (html) $(colheader).html(html);

      return $(colheader).text().trim();
    });

    let columns = [
      {
        name: 'startTime',
        title: 'שעת יציאה',
        data: 'OrderStartTime',
        className: 'bold status-color',
        
        render: DataTablesGlobal.timeRender(() => { return   'DD/MM/YY HH:mm'; })

      }
      ,
      
      {
        name: 'plate',
        title: 'רכב',
        data: 'CarNumber',
        className: 'ltr plate-col evt-col bold status-color',
        // width: '6em'

      },
      {
        name: 'driver',
        title: 'נהג',
        data: 'DriverName',
        className: 'bold status-color' ,


        render: (locs: string, type: any, trip: Trip,) => {

          return trip.DriverName + ` <a href="tel:` + trip.DriverCell + `">` + trip.DriverCell + `</a>`
        }
      },

      {
        name: 'statusPlace',
        title: `סטטוס`,
        data: 'CurrentPlace',
        className: 'evt-col  data-col status-color',
        

      },
      {
        name: 'statusCol',
        title: `מיקום`,
        data: 'GetTripStatus',
        className: 'data-col evt-col status-color',
        

      },
      {
        name: 'routeid',
        title: 'מוקד',
        data: 'Route',
      //  className: 'status-color',
        visible:false


      },
      {
        name: 'islate',
        title: 'מאחר',
        data: 'IsLate',
        className: 'status-color',
        visible:false


      }
     
    ]


    if (!environment.production) columns.push({ name: 'lineCode', title: '', data: 'LineCode', className: "" });

    this.dtOptions = {
      destroy: true,
      processing: true,
      ajax: (data, cb, settings) => {
        let trips = this.trips$.getValue();
        if (trips && trips.length) {
          if (trips[0] == null) cb({ data: [] });
          else cb({ data: trips });

        }

      },

      columns: columns,
      dom: "<tr><'p-3'<'float-right ml-3' B><'info float-left'i>>",
      paging: false,
      scrollY: '70vh',
      scrollX: true,
 
      scrollCollapse: true,

      rowId: 'LineCode',
      info: true,
      language: {
        loadingRecords: 'אנא המתן, טוען מידע...',
        zeroRecords: 'אין נסיעות מתאימות להצגה',
        emptyTable: 'לא נמצאו נסיעות',
        info: '_TOTAL_ נסיעות',
        infoEmpty: '0 נסיעות',
        infoFiltered: '(מתוך _MAX_ נסיעות)',
        processing: 'מעבד...',
      },
 
      //order: [[columns.findIndex(x => x.data == 'IsLate'),'asc'],[ columns.findIndex(x => x.data == 'OrderStartTime'),'asc']],
      order: [ columns.findIndex(x => x.data == 'OrderStartTime'),'asc'],
      buttons: {
        buttons: [
          {
            extend: 'excelHtml5',
            text: 'ייצא לאקסל',
            autoFilter: true,
            className: 'btn-outline-primary',
            sheetName: 'נסיעות',
            filename: 'ניטור נסיעות ' + new Date().format('DD.MM.YYYY'),
            createEmptyCells: true,
            exportOptions: {

              columns: ':not(.no-export)'
            }

          },
          // {
          //   text: 'עבור לשעה נוכחית',
          //   action: this.scrollToCurrRow,
          //   className: 'btn-outline-info'
          // },



        ],
        dom: {
          container: {
            className: ''
          },
          button: {

            className: 'btn btn-sm'
          }
        }
      },
      drawCallback: () => {
        if (!this.firstDraw) this.registerEvents();
        //this.refreshSerach()
        this.dtElement.dtInstance.then((api: any) => {


          let head = api.column('statusCol:name').header();
          $(head).find('.fa-spinner').toggleClass('d-none', !this.service.reqPending());

        })

      },
      rowCallback: (row: Node, data: Trip, idx) => {
        $(row).toggleClass('red-row', data.alert || (data.state != null && data.state && (data.state.Status == TripStatus.noIturan || data.state.Status == TripStatus.noData || data.state.Status == TripStatus.noMakat || data.state.Status == TripStatus.noDone || data.state.Status == TripStatus.noPlate || (data.reqStatus == reqStatus.complete && data.state.Status == TripStatus.far && data.state.Dist > 500 && data.timeSpan > -15))))
        if (this.isUser() && data.state) {
          if( data.state.ToChange)
          $(row).find('.status-color').toggleClass('danger', data.state&& data.state.ToChange)
          else
          //$(row).toggleClass('red-blue',data.state!=null &&data.state && data.state.Status == TripStatus.noIturan )
          $(row).find('.status-color').toggleClass(this.statusColor(data.state.SenderStatus),true);
         // $(row).toggleClass('status-color ' +, true)
        }
       
      }
      ,
      /*footerCallback: ( row, data, start, end, display ) =>
      {
         
    
      }*/
    };

    $.fn['dataTable'].ext.search.push((settings, searchData, index, rowData: Trip, counter) => {
      if (settings.sInstance == 'tripsTable') {


        return true;// ( !rowData.state || ( rowData.state && rowData.state.Status != TripStatus.end) || (rowData.state && !rowData.state.ExitTime))

      }
      return true;
    });

    this.trips$.pipe(auditImmediateTime(1000)).subscribe((trips: Trip[]) => {
      if (this.dtElement) {


        this.dtElement.dtInstance.then(api => {

          api.ajax.reload(null, false);

          api.columns.adjust();

        });

        // if (!this.firstScroll) {
        //   this.scrollToCurrRow();
        // }
      }
    })

    // setInterval(this.scrollToCurrRow, 5 * 60 * 1000)
  }
  statusColor(sta:string) {
    if(!sta) return '';
        if (sta == 'יגיע בזמן') return 'clightgreen';
        else if (sta == 'לא יגיע') return 'cred';
        else if (sta == 'לא עונה') return 'cpurple';
        else if (sta== 'מאחר') return 'corange';
        return ''
      }
  
  isUser() {
    return (this.service.isUser)
  }
   
     
  
  registerEvents() {

    // this.refreshSerach();
    this.firstDraw = true;
    
    $('#tripsTable_wrapper .dataTables_scrollBody table').on('click', 'td', (ev) => {
      if (ev.currentTarget.className.includes('evt-col')) {
        this.dtElement.dtInstance.then(api => {
          var tr = $(ev.currentTarget).closest('tr');
          var trip: any = api.row(tr).data();
          if (!trip) return

          if (ev.currentTarget.className.includes('plate-col')) {
            const modalRef = this.modalService.open(TableModalComponent, { size: 'xl' });
            modalRef.componentInstance.data = this.service.trips.filter(x => x.CarNumber == trip.CarNumber);
            let col=['שעת יציאה', 'נהג','מיקום', 'סטטוס'].map(x => this.dtOptions.columns.find(c => c.title == x))
            col.push({ name: 'routeid', title: 'מוקד',      data: 'Route'})
            modalRef.componentInstance.tableOpt = {
              columns:col,
              order: [0, 'asc']
            };
            modalRef.componentInstance.title = 'נסיעות לרכב' + ': ' +trip.CarNumber

          }
          if (ev.currentTarget.className.includes('data-col')) {
            const modalRef = this.modalService.open(FleetControlMobileDetailsComponent, { size: 'lg' });
            modalRef.componentInstance.trip = trip;
             

          }
        });
      }
    });

    $('#tripsTable_wrapper .dataTables_scrollBody table').on('click', '.fa-sync-alt', (ev) => {
      var tr = $(ev.currentTarget).closest('tr');
      this.dtElement.dtInstance.then(api => {
        var trip = api.row(tr).data();
        (trip as Trip).reqLocations(true);
      });
    });


    this.dtElement.dtInstance.then((api: any) => {

      let head = $(api.column('statusCol:name').header());
      head.children().on('click', '.dropdown-toggle, .retry-locs, .refresh-all-locs', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.currentTarget.className.includes('dropdown-toggle')) head.find('.dropdown-menu').toggle();
        if (ev.currentTarget.className.includes('retry-locs')) { this.service.retryLocs(); head.find('.dropdown-menu').toggle(); }
        if (ev.currentTarget.className.includes('refresh-all-locs')) {
          this.service.retryLocs(true); head.find('.dropdown-menu').toggle();
        }
      });

    });
  }

  refreshSerach() {

    $('#tripsTable_wrapper .dataTables_scrollHead table thead tr:eq(1)').remove()
    this.dtElement.dtInstance.then((api: any) => {
      var col = '60;250;70;70;80;80;150;50;120;120'.split(';');
      var colname = ['מוקד', 'רכב', 'נהג', 'סטטוס']
      var colname1 = ['routeId', 'plate', 'driver', 'statusCol']
      //var lin=$('#tripsTable_wrapper .dataTables_scrollHead table thead tr:eq(1) th');
      var cols = ''
      let n = 0;
      for (n = 0; n < $('#tripsTable_wrapper .dataTables_scrollHead table thead tr:eq(0) th').length; n++)
        cols += `<th>${$('#tripsTable_wrapper .dataTables_scrollHead table thead tr:eq(0) th')[n].innerText.trim()}</th>`
      $(`<tr>${cols} </tr>`).clone(true).appendTo('#tripsTable_wrapper .dataTables_scrollHead table thead');
      //$('#tripsTable_wrapper .dataTables_scrollHead table thead tr:eq(0)').clone(true).appendTo('#tripsTable_wrapper .dataTables_scrollHead table thead');
      $('#tripsTable_wrapper .dataTables_scrollHead table thead tr:eq(1) th').each(function (i) {

        //if(colm.visible())
        {
          let colid = colname.indexOf(this.textContent);
          if (colid >= 0)
          //if (',0,1,2,3,4,5,6,'.includes(`,${this.textContent},`)) 
          {
            //$(this).html('')
            let colm = api.column(`${colname1[colid]}:name`)


            $(this).html('<input type="search" value="' + colm.search() + '" class="form-control input-sm"   style="width: ' + col[colid] + 'px;height:35px;" placeholder="" />');
            // $(this).html('<input id="'+ colname[this.textContent]+'" type="search" value="'+ colm.search() +'" class="form-control input-sm" placeholder="" />');
            $('input', this).on('keyup change search', function () {

              if (colm.search() !== $(this).val().toString()) {
                colm
                  .search($(this).val().toString())
                  .draw();
              }
            }

            );

          }
          else
            $(this).html('')
        }
        //else
        //$(this).html('')
      });
    });
  }

  // scrollToCurrRow = () => {
  //   this.dtElement.dtInstance.then(api => {
  //     const data = api.rows({ search: 'applied' }).data().toArray();
  //     const now = moment().subtract(5, 'm');
  //     let trip = data.find((x: Trip) => moment(x.OrderStartTime).isAfter(now));
  //     if (!trip) return;
  //     let rowNode = api.row('#' + trip.LineCode).node();
  //     if (!(rowNode as HTMLElement).offsetTop) return;
  //     $('#tripsTable_wrapper .dataTables_scrollBody').animate({
  //       scrollTop: (rowNode as HTMLElement).offsetTop - 130
  //     }, 400);
  //     this.firstScroll = true;
  //   });
  // }



}
