import * as moment from 'moment';

export class DataTablesGlobal {
    static timeRender = (format?:string | Function) => {
        if (!format) format = 'HH:mm';
        return (time: string | Date, type:any, rowData: any, meta) => {
            if (!time) return '';
            if(type == 'display') {
            return moment(time).format(typeof format == 'string' ? format : format());
            }
            return new Date(time).toISOString();
        }
    }

    static defaultOpt = {
        destroy: true,
        info: true,
        paging: false,
        dom: "<t><'p-3'<'info float-left'i>>",
        language: {
            loadingRecords: 'אנא המתן, טוען מידע...',
            zeroRecords: 'אין רשומות מתאימות להצגה',
            emptyTable: 'לא נמצאו רשומות',
            info: '_TOTAL_ רשומות',
            infoEmpty: '0 רשומות',
            infoFiltered: '(מתוך _MAX_ רשומות)',
            processing: 'מעבד...',
          },
    }
}