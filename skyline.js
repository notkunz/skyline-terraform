// ============ INITIALIZATION ============
document.addEventListener("DOMContentLoaded", () => {
  initializeScrollAnimations();
  initializeFormValidation();
  initializeNavigation();
  initializeServiceCards();
  initializeCarousel();
  initializeScrollSpyNav();
  initializeCounterAnimation();
  initializeSmoothScroll();
  initializeAdminPanel();
});

// ============ SCROLL ANIMATIONS ============
const initializeScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for multiple elements
        setTimeout(() => {
          entry.target.classList.add("visible");
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Animate section headers on scroll
  document.querySelectorAll(".section-header").forEach((header) => {
    observer.observe(header);
    header.classList.add("fade-in");
  });
};

// ============ SMOOTH SCROLL ============
const initializeSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
};

// ============ FORM VALIDATION & SUBMISSION ============
const initializeFormValidation = () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector("textarea").value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      showNotification("Please fill all required fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      e.preventDefault();
      showNotification("Please enter a valid email", "error");
      return;
    }

    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      showNotification("Thanks. Your project details are on their way.");
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      showNotification(
        "We couldn't send your message. Please try again.",
        "error",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
};

// ============ FORM FIELD LISTENERS ============
document
  .querySelectorAll(".form-group input, .form-group textarea")
  .forEach((field) => {
    field.addEventListener("input", () => {
      // Real-time validation feedback
      if (field.type === "email" && field.value) {
        field.style.borderColor = isValidEmail(field.value)
          ? "#f59e0b"
          : "#ef4444";
      }
    });

    field.addEventListener("blur", () => {
      // Validate on blur
      if (field.value) {
        if (field.type === "email" && !isValidEmail(field.value)) {
          field.style.borderColor = "#ef4444";
        } else {
          field.style.borderColor = "#cbd5e1";
        }
      }
    });
  });

// ============ UTILITY: EMAIL VALIDATION ============
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ============ NOTIFICATION SYSTEM ============
const showNotification = (message, type = "success") => {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === "success" ? "#10b981" : "#ef4444"};
                color: white;
                border-radius: 8px;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.4s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            `;
  notification.textContent = message;

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
};

// ============ SERVICE CARDS INTERACTIVITY ============
const initializeServiceCards = () => {
  const cards = document.querySelectorAll(".service-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showServiceModal(card);
    });

    // Add keyboard accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        showServiceModal(card);
      }
    });
  });
};

// ============ SERVICE MODAL ============
const showServiceModal = (card) => {
  const title = card.querySelector("h3").textContent;
  const description = card.querySelector("p").textContent;
  const icon = card.querySelector(".service-icon").textContent;

  const modal = document.createElement("div");
  modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(4px);
            `;

  modal.innerHTML = `
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease;
                    position: relative;
                ">
                    <button onclick="this.closest('div').parentElement.remove()" style="
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        background: #f59e0b;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#0f172a'; this.style.color='#f59e0b'" onmouseout="this.style.background='#f59e0b'; this.style.color='black'">×</button>
                    
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #0f172a; font-weight: 700;">${title}</h2>
                    <p style="color: #64748b; line-height: 1.8; margin-bottom: 2rem;">${description}</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <button onclick="this.closest('div').parentElement.parentElement.remove(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });" style="
                            background: #f59e0b;
                            color: #0f172a;
                            padding: 0.8rem 1.5rem;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: 600;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 30px rgba(245, 158, 11, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">Get Quote</button>
                        
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            background: #e2e8f0;
                            color: #0f172a;
                            padding: 0.8rem 1.5rem;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: 600;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">Close</button>
                    </div>
                </div>
            `;

  // Add animations
  const style = document.createElement("style");
  style.textContent = `
                @keyframes slideUp {
                    from {
                        transform: translateY(40px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(modal);

  // Close modal on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Close on ESC key
  const closeOnEsc = (e) => {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", closeOnEsc);
    }
  };
  document.addEventListener("keydown", closeOnEsc);
};

// ============ STAFF ADMIN ============
const STAFF_BUCKET = "staff-photos";
const STAFF_TABLE = "staff";
const LEGACY_STAFF_KEY = "skyline-staff-records";
let supabaseClient;
let activeStaff = [];

const initializeAdminPanel = async () => {
  const login = document.getElementById("adminLogin");
  const staffForm = document.getElementById("staffForm");
  const loginForm = document.getElementById("adminLoginForm");
  if (!login || !staffForm || !loginForm) return;

  const config = window.SKYLINE_SUPABASE_CONFIG;
  if (
    !window.supabase?.createClient ||
    !config?.url ||
    !config?.anonKey ||
    !config?.adminUsername ||
    !config?.adminEmail ||
    config.url.includes("YOUR_") ||
    config.anonKey.includes("YOUR_") ||
    config.adminEmail.includes("YOUR_")
  ) {
    setAdminMessage(
      "Set adminEmail in supabase-config.js and run supabase-setup.sql to enable admin sign-in.",
      true,
    );
  } else {
    supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  }

  document.querySelectorAll("[data-admin-open]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (!supabaseClient) {
        document.getElementById("adminLogin").hidden = false;
        return;
      }
      login.hidden = false;
      document.getElementById("adminUsername").focus();
    });
  });
  document
    .querySelectorAll("[data-admin-close]")
    .forEach((button) => button.addEventListener("click", closeAdmin));
  login.addEventListener("click", (event) => {
    if (event.target === login) closeAdmin();
  });
  loginForm.addEventListener("submit", signInAdmin);
  staffForm.addEventListener("submit", addStaffRecord);
  document
    .getElementById("adminSignOut")
    .addEventListener("click", signOutAdmin);

  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) setAdminMessage(error.message, true);
  else if (data.session) await showAdmin();
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => (session ? showAdmin() : hideAdmin()), 0);
  });
};

const closeAdmin = () => {
  document.getElementById("adminLogin").hidden = true;
  document.getElementById("adminLoginForm").reset();
  setAdminMessage("");
};

const signInAdmin = async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  setAdminMessage("Signing in...");
  const enteredUsername = document.getElementById("adminUsername").value.trim();
  if (enteredUsername.toLowerCase() !== configUsername().toLowerCase()) {
    button.disabled = false;
    setAdminMessage("Sign-in failed. Check your username and password.", true);
    return;
  }
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: window.SKYLINE_SUPABASE_CONFIG.adminEmail,
    password: document.getElementById("adminPassword").value,
  });
  button.disabled = false;
  if (error) {
    setAdminMessage(
      "Supabase rejected the account credentials. Check adminEmail in supabase-config.js and confirm this Supabase Auth user has an email/password login.",
      true,
    );
  } else {
    closeAdmin();
  }
};

const configUsername = () => window.SKYLINE_SUPABASE_CONFIG.adminUsername;

const signOutAdmin = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) showNotification(error.message, "error");
};

const showAdmin = async () => {
  closeAdmin();
  document.getElementById("admin").hidden = false;
  await migrateLegacyStaff();
  await loadStaff();
  document.getElementById("admin").scrollIntoView({ behavior: "smooth" });
};

const hideAdmin = () => {
  document.getElementById("admin").hidden = true;
  document.getElementById("printArea").replaceChildren();
  activeStaff = [];
  document.getElementById("staffList").replaceChildren();
  document.getElementById("staffCount").textContent = "0 staff";
};

const setAdminMessage = (message, isError = false) => {
  const target = document.getElementById("adminLoginMessage");
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("error", isError);
};

const setDataMessage = (message, isError = false) => {
  const target = document.getElementById("adminDataMessage");
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("error", isError);
};

const addStaffRecord = async (event) => {
  event.preventDefault();
  const record = {
    name: document.getElementById("staffName").value.trim(),
    position: document.getElementById("staffPosition").value.trim(),
    email: document.getElementById("staffEmail").value.trim() || null,
    phone: document.getElementById("staffPhone").value.trim() || null,
    staff_number:
      document.getElementById("staffNumber").value.trim() ||
      `ST-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`,
  };
  const { error } = await supabaseClient.from(STAFF_TABLE).insert(record);
  if (error) {
    if (
      error.code === "23505" &&
      error.message.includes("staff_staff_number_key")
    ) {
      setDataMessage(
        "That Staff ID is already in use. Enter a different ID, or clear the Staff ID field and submit to generate one automatically.",
        true,
      );
    } else if (error.code === "42501") {
      setDataMessage(
        "Your account signed in but is not on the staff admin allowlist. Run supabase-setup.sql in Supabase SQL Editor, and confirm the admin email in that script matches supabase-config.js.",
        true,
      );
    } else {
      setDataMessage(`Could not add staff record: ${error.message}`, true);
    }
    return;
  }
  event.currentTarget.reset();
  setDataMessage("Staff record saved to the Skyline database.");
  await loadStaff();
};

const loadStaff = async () => {
  setDataMessage("Loading staff records...");
  const { data, error } = await supabaseClient
    .from(STAFF_TABLE)
    .select(
      "id, name, position, email, phone, staff_number, photo_path, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) {
    setDataMessage(`Could not load staff: ${error.message}`, true);
    return;
  }
  activeStaff = await Promise.all(
    data.map(async (person) => {
      if (!person.photo_path) return { ...person, photo_url: "" };
      const { data: signed, error: photoError } = await supabaseClient.storage
        .from(STAFF_BUCKET)
        .createSignedUrl(person.photo_path, 3600);
      return { ...person, photo_url: photoError ? "" : signed.signedUrl };
    }),
  );
  setDataMessage("");
  renderStaff();
};

const migrateLegacyStaff = async () => {
  let legacy;
  try {
    legacy = JSON.parse(localStorage.getItem(LEGACY_STAFF_KEY) || "[]");
  } catch {
    legacy = [];
  }
  if (!Array.isArray(legacy) || !legacy.length) return;
  setDataMessage("Importing staff records saved on this device...");
  for (const person of legacy) {
    const id = /^[\da-f-]{36}$/i.test(person.id)
      ? person.id
      : crypto.randomUUID();
    let photoPath = null;
    if (person.photo?.startsWith("data:image/")) {
      try {
        const image = await (await fetch(person.photo)).blob();
        photoPath = `${id}/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabaseClient.storage
          .from(STAFF_BUCKET)
          .upload(photoPath, image, { contentType: "image/jpeg" });
        if (uploadError) photoPath = null;
      } catch {
        photoPath = null;
      }
    }
    const { error } = await supabaseClient.from(STAFF_TABLE).upsert(
      {
        id,
        name: person.name,
        position: person.position,
        email: person.email || null,
        phone: person.phone || null,
        staff_number:
          person.staffNumber || `ST-${String(Date.now()).slice(-6)}`,
        photo_path: photoPath,
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
    if (error) {
      setDataMessage(
        `Could not import old local records: ${error.message}`,
        true,
      );
      return;
    }
  }
  localStorage.removeItem(LEGACY_STAFF_KEY);
  setDataMessage("Previous device records have been imported into Supabase.");
};

const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

const renderStaff = () => {
  const list = document.getElementById("staffList");
  const count = document.getElementById("staffCount");
  if (!list || !count) return;

  const staff = activeStaff;
  count.textContent = `${staff.length} ${staff.length === 1 ? "staff member" : "staff members"}`;

  if (!staff.length) {
    list.innerHTML =
      '<p class="directory-empty">No staff added yet. New staff records will appear here.</p>';
    return;
  }

  list.innerHTML = staff
    .map(
      (person) => `
    <article class="staff-item">
      <div class="staff-avatar">${person.photo_url ? `<img src="${person.photo_url}" alt="" />` : `<span>${escapeHTML(person.name.slice(0, 1).toUpperCase())}</span>`}</div>
      <div class="staff-details">
        <h4>${escapeHTML(person.name)}</h4>
        <p>${escapeHTML(person.position)}</p>
        <p>${escapeHTML(person.staff_number)}</p>
        ${person.phone ? `<p>${escapeHTML(person.phone)}</p>` : ""}
        ${person.email ? `<p>${escapeHTML(person.email)}</p>` : ""}
        <div class="staff-actions">
          <button class="staff-card-action" type="button" data-action="photo" data-id="${escapeHTML(person.id)}">${person.photo_path ? "Change photo" : "Create ID card"}</button>
          ${person.photo_path ? `<button class="staff-card-action secondary" type="button" data-action="print" data-id="${escapeHTML(person.id)}">Print ID</button>` : ""}
          <button class="staff-card-action secondary" type="button" data-action="delete" data-id="${escapeHTML(person.id)}">Remove</button>
        </div>
      </div>
    </article>
  `,
    )
    .join("");

  list.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () =>
      handleStaffAction(button.dataset.action, button.dataset.id),
    );
  });
};

const handleStaffAction = async (action, staffId) => {
  const person = activeStaff.find((record) => record.id === staffId);
  if (!person) return;

  if (action === "photo") {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/*";
    picker.setAttribute("aria-label", `Choose ID photo for ${person.name}`);
    picker.addEventListener("change", () => {
      const file = picker.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showNotification("Choose an image file for the ID photo.", "error");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = new Image();
        image.addEventListener("load", () => {
          const scale = Math.min(1, 600 / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          canvas
            .getContext("2d")
            .drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                showNotification(
                  "Could not process the selected photo.",
                  "error",
                );
                return;
              }
              const newPath = `${person.id}/${crypto.randomUUID()}.jpg`;
              const { error: uploadError } = await supabaseClient.storage
                .from(STAFF_BUCKET)
                .upload(newPath, blob, { contentType: "image/jpeg" });
              if (uploadError) {
                showNotification(
                  `Photo upload failed: ${uploadError.message}`,
                  "error",
                );
                return;
              }
              const oldPath = person.photo_path;
              const { error: updateError } = await supabaseClient
                .from(STAFF_TABLE)
                .update({ photo_path: newPath })
                .eq("id", person.id);
              if (updateError) {
                await supabaseClient.storage
                  .from(STAFF_BUCKET)
                  .remove([newPath]);
                showNotification(
                  `Could not save photo reference: ${updateError.message}`,
                  "error",
                );
                return;
              }
              if (oldPath)
                await supabaseClient.storage
                  .from(STAFF_BUCKET)
                  .remove([oldPath]);
              await loadStaff();
              await renderIdCard(
                activeStaff.find((entry) => entry.id === person.id),
              );
              showNotification(
                "ID photo saved. Staff details were left unchanged.",
              );
            },
            "image/jpeg",
            0.82,
          );
        });
        image.src = reader.result;
      });
      reader.readAsDataURL(file);
    });
    picker.click();
    return;
  }

  if (action === "print") {
    await renderIdCard(person);
    window.print();
    return;
  }

  if (
    action === "delete" &&
    window.confirm(`Remove ${person.name} from the staff directory?`)
  ) {
    if (person.photo_path) {
      const { error: photoError } = await supabaseClient.storage
        .from(STAFF_BUCKET)
        .remove([person.photo_path]);
      if (photoError)
        showNotification(
          `Could not remove photo: ${photoError.message}`,
          "error",
        );
    }
    const { error } = await supabaseClient
      .from(STAFF_TABLE)
      .delete()
      .eq("id", staffId);
    if (error) {
      showNotification(
        `Could not remove staff record: ${error.message}`,
        "error",
      );
      return;
    }
    document.getElementById("printArea").replaceChildren();
    await loadStaff();
  }
};

const renderIdCard = async (person) => {
  if (!person?.photo_path) {
    showNotification("Add an ID photo before printing this card.", "error");
    return;
  }
  const { data, error } = await supabaseClient.storage
    .from(STAFF_BUCKET)
    .createSignedUrl(person.photo_path, 3600);
  if (error) {
    showNotification(`Could not load ID photo: ${error.message}`, "error");
    return;
  }
  const printArea = document.getElementById("printArea");
  printArea.innerHTML = `
    <div class="id-card-preview id-card-front">
      <div class="id-card-brand">
        <img class="id-card-logo" src="skyline%20logo.jpeg" alt="Skyline Terraform Limited" />
        <div class="id-card-brand-copy">
          <strong>STAFF IDENTIFICATION</strong>
          <span>AUTHORIZED TEAM MEMBER</span>
        </div>
      </div>
      <div class="id-card-body">
        <img class="id-card-photo" src="${data.signedUrl}" alt="ID photo of ${escapeHTML(person.name)}" />
        <div class="id-card-info">
          <p class="id-card-label">${escapeHTML(person.staff_number)}</p>
          <h3>${escapeHTML(person.name)}</h3>
          <p class="id-card-position">${escapeHTML(person.position)}</p>
          ${person.phone ? `<p>${escapeHTML(person.phone)}</p>` : ""}
          ${person.email ? `<p>${escapeHTML(person.email)}</p>` : ""}
        </div>
      </div>
      <div class="id-card-footer">PROPERTY OF SKYLINE TERRAFORM LIMITED <span>AUTHORIZED STAFF</span></div>
    </div>`;
  printArea.insertAdjacentHTML(
    "beforeend",
    `
    <div class="id-card-preview id-card-back">
      <div class="id-card-brand id-card-back-brand">
        <img class="id-card-logo" src="skyline%20logo.jpeg" alt="Skyline Terraform Limited" />
        <div class="id-card-brand-copy">
          <strong>STAFF IDENTIFICATION</strong>
          <span>AUTHORIZED TEAM MEMBER</span>
        </div>
      </div>
      <div class="id-card-back-copy">
        <strong>CARDHOLDER POLICY</strong>
        <ul>
          <li>For authorized staff use only. Do not lend or transfer.</li>
          <li>Wear visibly on company premises and project sites.</li>
          <li>Report lost, stolen, or damaged cards to management immediately.</li>
          <li>Return when employment ends. This card remains Skyline Terraform Limited property.</li>
        </ul>
      </div>
      <div class="id-card-return">
        <strong>IF THIS CARD IS FOUND, PLEASE RETURN IT TO</strong>
        <p>Skyline Terraform Limited · Lagos, Nigeria</p>
        <p>+234 8114247254</p>
        <p>skylineterraformlimited@gmail.com</p>
      </div>
      <div class="id-card-signatures">
        <span><i></i> HOLDER SIGNATURE</span>
        <span><i></i> AUTHORIZED SIGNATURE</span>
      </div>
      <div class="id-card-footer">CORPORATE STAFF IDENTIFICATION <span>NOT A GOVERNMENT ID</span></div>
    </div>`,
  );
  await Promise.all(
    Array.from(printArea.querySelectorAll("img"), (image) =>
      image.decode().catch(() => undefined),
    ),
  );
};

// ============ CAROUSEL FUNCTIONALITY ============
const initializeCarousel = () => {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("indicators");

  let currentIndex = 0;
  let autoPlayInterval;

  // Create indicators
  slides.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();
  };

  const updateIndicators = () => {
    document
      .querySelectorAll(".carousel-indicator")
      .forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
    resetAutoPlay();
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
    resetAutoPlay();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
    resetAutoPlay();
  };

  const autoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlay();
  };

  // Event listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Start auto-play
  autoPlay();

  // Pause on hover
  track.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
  track.addEventListener("mouseleave", autoPlay);
};

// ============ SCROLL SPY NAVIGATION ============
const initializeScrollSpyNav = () => {
  const sections = document.querySelectorAll(
    '[id="services"], [id="portfolio"], [id="process"], [id="about"], [id="contact"]',
  );
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.style.color = "white";
      if (link.getAttribute("href").slice(1) === current) {
        link.style.color = "#f59e0b";
      }
    });
  });
};

// ============ NAVIGATION ACTIVE STATE ============
const initializeNavigation = () => {
  // CTA buttons
  document
    .querySelectorAll(".btn-primary, .btn-secondary, .cta-btn")
    .forEach((btn) => {
      btn.addEventListener("mouseover", () => {
        btn.style.transform = "translateY(-3px)";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.transform = "translateY(0)";
      });
    });

  // Mobile menu toggle (if needed)
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const navMenu = document.querySelector("nav ul");
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelector(".nav-menu").classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
};

// ============ COUNTER ANIMATION (Stats) ============
const initializeCounterAnimation = () => {
  // Placeholder for stats counters if added
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length === 0) return;

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
};

// ============ HEADER SCROLL EFFECT ============
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "none";
  }
});

// ============ PERFORMANCE: LAZY LOADING ============
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img").forEach((img) => imageObserver.observe(img));
}
