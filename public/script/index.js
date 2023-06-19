$(function () {
  $('#form-pin-download').on('submit', function (event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {}

    for (const [key, val] of formData) {
      data[key] = val
    }

    $('#btn-icon').addClass('fa-spinner fa-spin').removeClass('fa-download')

    $.ajax({
      url: `/download?url=${data['pin-board-url']}`,
      type: 'POST',
      success: function (response) {
        $('#btn-icon').addClass('fa-download').removeClass('fa-spinner fa-spin')
      },
      error: function (xhr, status, error) {
        console.error(error)
      }
    })
  })
})
