import Vue from 'vue'

function parseOption(option) {
    if ($$.isFunction(option)) {
        option = {
            success: option
        }
    }
    option = $$.extend(true, {
        page: false,
    }, option || {})

    if (option.page !== false) {

        var _page
        if ($$.isPlainObject(option.page)) {
            _page = option.page
        } else {
            if ($$.isNumber(option.page)) {
                _page = [option.page, 20]
            } else if ($$.isString(option.page)) {
                _page = option.page.split(',')
            } else if ($$.isArray(option.page)) {
                _page = option.page
            }
            _page = {
                index: _page[0] || 1,
                rows: _page[1] || 20
            }
        }
        option.page = _page
        option.page.pagi = _page.index + ',' + _page.rows
    }
    option.xhrFields= {withCredentials: true}
    option.crossDomain=true
    return option
}

function calcServerUrl(url) {
    return /^https?\:\/\//.test(url) ? url : (Vue.config.domain + url)
    //return 'https://api.shibu365.com/'+url
}

export default {
    request(url, param, option) {
        if ($$.isFunction(param)) {
            option = param
            param = null
        }
        option = parseOption(option)

        if (option.page) {
            param = $$.extend(true, {
                page: option.page
            }, param || {})
            delete option.page
        }
        option.ready = xhr => {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

        }
        $$.ajax(calcServerUrl(url), param || null, option)

    },
    upload(url, fd, option) {
        url = url || Vue.config.uploadServer
        if (!($$.isString(url) || url instanceof FormData)) {
            throw 'invalid param: url'
        }
        if (url instanceof FormData) {
            option = fd
            fd = url
            url = Vue.config.uploadServer
        }

        if (!fd || !(fd instanceof FormData)) {
            throw 'invalid param: fd'
        }

        option = parseOption(option)

        delete option.page

        option = $$.extend(true, {}, {
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            ready: xhr => {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            }
        }, option)

        $$.ajax(calcServerUrl(url), fd, option)
    }
}