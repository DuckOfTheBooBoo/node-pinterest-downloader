$(function () {
  $('#form-pin-download').on('submit', function (event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {}

    for (const [key, val] of formData) {
      data[key] = val
    }

    $.ajax({
      url: `/api/download?${data['pin-board-url']}`,
      type: 'POST',
      success: function (response) {},
      error: function (xhr, status, error) {
        console.error(error)
      }
    })
  })
})
