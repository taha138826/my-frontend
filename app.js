const pb = new PocketBase("https://my-pocketbase-app-0fzr.onrender.com");

async function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) {
    alert("لطفاً نام کاربری و رمز عبور رو پر کن!");
    return;
  }
  if (password.length < 8) {
    alert("رمز عبور باید حداقل ۸ کاراکتر باشه!");
    return;
  }
  try {
    await pb.collection("users").create({
      username: username,
      password: password,
      passwordConfirm: password,
      email: `${username}@example.com`,
      isActive: false,
      score: 0,
    });
    alert("ثبت‌نام با موفقیت انجام شد! منتظر تأیید ادمین باش.");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } catch (e) {
    alert("خطا در ثبت‌نام: " + (e.message || "مشکلی پیش اومد"));
  }
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  console.log("Trying to login with:", username, password); // برای دیباگ
  if (!username || !password) {
    alert("لطفاً نام کاربری و رمز عبور رو پر کن!");
    return;
  }
  try {
    const authData = await pb.collection("users").authWithPassword(username, password);
    console.log("Login successful:", authData); // برای دیباگ
    if (pb.authStore.model.isActive) {
      document.getElementById("login").style.display = "none";
      document.getElementById("main").style.display = "block";
      document.getElementById("admin").style.display = "block";
    } else {
      alert("حساب شما هنوز تأیید نشده! با ادمین تماس بگیر.");
      pb.authStore.clear();
    }
  } catch (e) {
    alert("خطا در ورود: " + (e.message || "نام کاربری یا رمز عبور اشتباهه"));
  }
}

// توابع مدیریت (برای اینکه کامل باشه)
const ADMIN_USER = "mtrb";
const ADMIN_PASS = "Mtrb2688@2688";

function enterAdmin() {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("adminUser").value = "";
    document.getElementById("adminPass").value = "";
  } else {
    alert("نام کاربری یا رمز ادمین اشتباهه!");
  }
}

async function approveUser() {
  const username = document.getElementById("targetUser").value.trim();
  if (!username) {
    alert("نام کاربری رو وارد کن!");
    return;
  }
  try {
    const user = await pb.collection("users").getFirstListItem(`username="${username}"`);
    await pb.collection("users").update(user.id, { isActive: true });
    alert(`کاربر ${username} با موفقیت تأیید شد!`);
    document.getElementById("targetUser").value = "";
  } catch (e) {
    alert("خطا: " + (e.message || "کاربر پیدا نشد"));
  }
}