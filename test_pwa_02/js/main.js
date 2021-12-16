$(document).ready(function() {
    var _url = "https://my-json-server.typicode.com/DhiasAchy/pwaapi/products";

    var dataResult = ''
    var catResult  = ''
    var categories = []

    function renderPage(data) {
        
        $.each(data, function(key,items) {

            _cat = items.category

            dataResult += "<div>"
                + "<h3>" + items.id + "</h3>"
                + "<p>" + _cat + "</p>"
                "<div>"
            ;

            // console.log(key)

            if($.inArray(_cat, categories) == -1) {
                categories.push(_cat)
                catResult += "<option value='"+ _cat + "'>" + _cat + "</option>"
            }
        })

        // menulis data
        $('#products').html(dataResult)
        // menulis option data
        $('#cat_select').html("<option value='all'>Semua</option>" + catResult)
        
    }

    var networkDataReceived = false

    // fecth data from online
    var networkUpdate = fetch(_url).then(function(response) {
        return response.json()
    }).then(function(data) {
        networkDataReceived = true
        renderPage(data)
    })

    // return data from cache
    caches.match(_url).then(function(response) {
        if (!response) throw Error('no data on cache')
        
        return response.json()
    }).then(function(data) {
        if(!networkDataReceived) {
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(function() {
        return networkUpdate
    })
    

    // fungsi filter
    $("#cat_select").on('change', function() {
        updateProduct($(this).val())
    })

    function updateProduct(cat) {

        var _newUrl = _url

        if (cat != 'all') {
            _newUrl = _url + "?id=" + cat
        }

        $.get(_url, function(data) {
            $.each(data, function(key,items) {
    
                _post = items.postId
    
                dataResult += "<div>"
                    + "<h3>" + items.id + "</h3>"
                    + "<p>" + items.id + "</p>"
                    "<div>"
                ;
    
                if($.inArray(items.id, categories) == -1) {
                    categories.push(items.id)
                    catResult += "<option value='"+ items.id + "'>" + items.id + "</option"
                }
            })
    
            // menulis data
            $('#products').html(dataResult)
        })
    }
})