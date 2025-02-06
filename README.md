# Food Rating Website

This is a simple food rating website using **HTML, CSS, and JavaScript**. Users can upload a food image and rate it with a thumbs-up, thumbs-down, or neutral response.

## Features
✅ Upload a food image
✅ Preview the image instantly
✅ Rate the image by selecting one of three reaction images
✅ Works entirely in the browser (no backend required)

---

## HTML, CSS, and JavaScript Code
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Rating</title>
    <style>
        body { text-align: center; font-family: Arial, sans-serif; }
        #imagePreview { width: 300px; margin-top: 20px; display: none; }
        .ratings img { width: 80px; cursor: pointer; opacity: 0.5; transition: 0.2s; }
        .ratings img:hover, .selected { opacity: 1; }
    </style>
</head>
<body>

    <h2>Upload a Food Image</h2>
    <input type="file" id="fileInput" accept="image/*">
    <br>
    <img id="imagePreview">

    <div class="ratings" style="margin-top: 20px;">
        <img src="thumbs-up.png" id="up" onclick="rate('up')">
        <img src="thumbs-middle.png" id="middle" onclick="rate('middle')">
        <img src="thumbs-down.png" id="down" onclick="rate('down')">
    </div>

    <script>
        const fileInput = document.getElementById("fileInput");
        const imagePreview = document.getElementById("imagePreview");

        fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });

        function rate(choice) {
            document.querySelectorAll(".ratings img").forEach(img => img.classList.remove("selected"));
            document.getElementById(choice).classList.add("selected");
        }
    </script>

</body>
</html>
```

---
