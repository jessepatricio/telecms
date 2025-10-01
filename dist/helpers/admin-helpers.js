"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.formatDate = exports.select = void 0;
const moment_1 = __importDefault(require("moment"));
const select = function (selected, options) {
    return options.fn({}).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
};
exports.select = select;
const formatDate = function (date, format) {
    return (0, moment_1.default)(date).format(format);
};
exports.formatDate = formatDate;
const paginate = function (options) {
    let output = '';
    if (options.hash.current === 1) {
        output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
    }
    else {
        output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
    }
    let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
    if (i !== 1) {
        output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
    }
    for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; ++i) {
        if (i === options.hash.current) {
            output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        }
        else {
            if (options.hash.abffpid === "") {
                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }
            else {
                output += `<li class="page-item"><a href="?page=${i}&abffpid=${options.hash.abffpid}" class="page-link">${i}</a></li>`;
            }
        }
        if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
    }
    if (options.hash.current === options.hash.pages) {
        output += `<li class="page-item disabled"><a  class="page-link">Last</a></li>`;
    }
    else {
        if (options.hash.abffpid === "") {
            output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
        }
        else {
            output += `<li class="page-item"><a href="?page=${options.hash.pages}&abffpid=${options.hash.abffpid}" class="page-link">Last</a></li>`;
        }
    }
    return output;
};
exports.paginate = paginate;
exports.default = {
    select: exports.select,
    formatDate: exports.formatDate,
    paginate: exports.paginate
};
//# sourceMappingURL=admin-helpers.js.map