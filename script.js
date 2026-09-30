const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#pageLoader").style.opacity = "0", 150);
  setTimeout(() => $("#pageLoader").style.display = "none", 650);
});

$("#year").textContent = new Date().getFullYear();

const nav = $("#nav");
$("#menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
$$(".nav a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

const tabs = $$(".menu-tabs button");
const foodCards = $$(".food-card");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const category = tab.dataset.category;
    foodCards.forEach(card => {
      card.classList.toggle("hide", category !== "all" && card.dataset.category !== category);
    });
  });
});

const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
$$(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeLightbox(); closeBookingModal(); }
});

const bookingDate = $("#bookingDate");
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
bookingDate.min = `${yyyy}-${mm}-${dd}`;

const bookingForm = $("#bookingForm");
const bookingModal = $("#bookingModal");
const confirmationText = $("#confirmationText");
const bookingId = $("#bookingId");

bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(bookingForm).entries());
  const selected = new Date(`${data.date}T${data.time}`);
  const now = new Date();
  if (selected < now) {
    $("#formStatus").textContent = "Please choose a future date and time.";
    return;
  }
  const booking = {
    ...data,
    id: `YOLO-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString()
  };
  const existing = JSON.parse(localStorage.getItem("cafeYoloBookings") || "[]");
  existing.push(booking);
  localStorage.setItem("cafeYoloBookings", JSON.stringify(existing));

  const niceDate = new Date(`${data.date}T12:00`).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });
  const message =
`☕ *Cafe YOLO — Table Booking Request*\n\n*Name:* ${data.name}\n*Mobile:* ${data.phone}\n*Date:* ${niceDate}\n*Time:* ${data.time}\n*Guests:* ${data.guests}\n*Special Request:* ${data.note || "None"}\n\n*Booking ID:* ${booking.id}\n\nHello Cafe YOLO, I would like to book a table for the above details. Please confirm my booking.`;
  const whatsappUrl = `https://wa.me/918055718253?text=${encodeURIComponent(message)}`;

  confirmationText.textContent = `Thanks ${data.name}. Your booking details are ready in WhatsApp. Tap “Open WhatsApp Again” and send the message to Cafe YOLO. The table is confirmed only after the café replies.`;
  bookingId.textContent = `BOOKING ID  •  ${booking.id}`;
  $("#whatsappAgain").href = whatsappUrl;
  bookingModal.classList.add("open");
  bookingModal.setAttribute("aria-hidden", "false");
  bookingForm.reset();
  bookingDate.min = `${yyyy}-${mm}-${dd}`;
  $("#formStatus").textContent = "";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});
function closeBookingModal() {
  bookingModal.classList.remove("open");
  bookingModal.setAttribute("aria-hidden", "true");
}
$("#successClose").addEventListener("click", closeBookingModal);
$("#successDone").addEventListener("click", closeBookingModal);
bookingModal.addEventListener("click", e => { if (e.target === bookingModal) closeBookingModal(); });

// Soft reveal for sections as they enter the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

$$(".section, .feature-photo, .quote-section, .instagram-card").forEach(el => {
  el.style.transition = "opacity .8s ease, transform .8s ease";
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  observer.observe(el);
});
