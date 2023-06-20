$(function () {
  $('#form-pin-download').on('submit', function (event) {
    event.preventDefault()

    if ($('.download-container').css('display') !== 'none') {
      $('.download-container').slideToggle()
    }
    const formData = new FormData(event.target)
    const data = {}

    for (const [key, val] of formData) {
      data[key] = val
    }

    $('#btn-icon').addClass('fa-spinner fa-spin').removeClass('fa-download')

    const downloadLink = $('#download-link')

    $.ajax({
      url: `/download?url=${data['pin-board-url']}`,
      type: 'POST',
      success: function (response) {
        $('#btn-icon').addClass('fa-download').removeClass('fa-spinner fa-spin')
        $('.download-container').slideToggle('slow')
        downloadLink.text(response.filename)
        downloadLink.attr('href', response.downloadUrl)
      },
      error: function (xhr, status, error) {
        console.error(error)
      }
    })
  })
})
