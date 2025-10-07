
/*ô nhập phiếu*/
<script>
const addBtn = document.getElementById("addBtn");
const formContainer = document.getElementById("formContainer");
const cancelBtn = document.getElementById("cancelBtn");

addBtn.addEventListener("click", () => {
    formContainer.style.display = "flex"; // hiện form
});

cancelBtn.addEventListener("click", () => {
    formContainer.style.display = "none"; // ẩn form
});
</script>
