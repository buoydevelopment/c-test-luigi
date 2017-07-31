$('.btn-shorten').on('click', function(){

  $.ajax({
    url: '/urls',
    type: 'POST',
    dataType: 'JSON',
    cache: false,
    data: {url: $('#url-field').val(), short_url: $('#short-code-field').val()},
    success: function(data){
        var resultHTML = '<a class="result" href="' + data.short_url + '">' + data.short_url + '</a>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
        $('#short-code-field').val('');
    }
  });

});