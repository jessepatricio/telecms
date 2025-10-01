import moment from 'moment';

interface PaginateOptions {
    hash: {
        current: number;
        pages: number;
        abffpid: string;
    };
}

export const select = function (selected: string, options: any): string {
    return options.fn({}).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
};

export const formatDate = function (date: any, format: string): string {
    return moment(date).format(format);
};

export const paginate = function (options: PaginateOptions): string {
    let output = '';

    if (options.hash.current === 1) {
        output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
    } else {
        output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
    }

    let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

    if (i !== 1) {
        output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
    }

    for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; ++i) {
        if (i === options.hash.current) {
            output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        } else {
            if (options.hash.abffpid === "") {
                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            } else {
                output += `<li class="page-item"><a href="?page=${i}&abffpid=${options.hash.abffpid}" class="page-link">${i}</a></li>`;
            }
        }

        //dots
        if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
    }

    if (options.hash.current === options.hash.pages) {
        output += `<li class="page-item disabled"><a  class="page-link">Last</a></li>`;
    } else {
        if (options.hash.abffpid === "") {
            output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=${options.hash.pages}&abffpid=${options.hash.abffpid}" class="page-link">Last</a></li>`;
        }
    }

    return output;
};

export default {
    select,
    formatDate,
    paginate
};
