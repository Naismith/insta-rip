$(document).ready(function() {
  $("#addUrl").click(function() {
    $(".input-container").append(`
		<div class="form-group">
			<label>URL</label>
			<input class="form-control" type="text" name="url" />
		</div>
		`);
  });
});
