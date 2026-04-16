// Gestion du modal d'édition
function openEditModal(id, nom, prenom, email) {
  const modal = document.getElementById('editModal');
  const form = document.getElementById('editForm');
  
  // Mettre à jour l'action du formulaire
  form.action = `/users/${id}/edit`;
  
  // Remplir les champs
  document.getElementById('editNom').value = nom;
  document.getElementById('editPrenom').value = prenom;
  document.getElementById('editEmail').value = email;
  
  // Afficher le modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  // Animation d'entrée
  const modalContent = modal.querySelector('.bg-white');
  modalContent.style.transform = 'scale(0.9)';
  modalContent.style.opacity = '0';
  setTimeout(() => {
    modalContent.style.transform = 'scale(1)';
    modalContent.style.opacity = '1';
  }, 10);
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  const modalContent = modal.querySelector('.bg-white');
  
  // Animation de sortie
  modalContent.style.transform = 'scale(0.9)';
  modalContent.style.opacity = '0';
  
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 200);
}

// Fermer le modal en cliquant en dehors
document.getElementById('editModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('editModal')) {
    closeEditModal();
  }
});

// Auto-hide des notifications après 5 secondes
setTimeout(() => {
  const notifications = document.querySelectorAll('.fixed.top-20.right-4');
  notifications.forEach(notification => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}, 5000);

// Validation des formulaires en temps réel
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Chargement...';
      
      // Réactiver après 2 secondes en cas d'erreur
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.innerHTML.replace('Chargement...', 'Ajouter');
      }, 2000);
    }
  });
});

// Animation des cartes statistiques
const cards = document.querySelectorAll('.grid > div');
cards.forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, index * 100);
});

// Recherche en temps réel (optionnel)
let searchTimeout;
const searchInput = document.querySelector('input[name="q"]');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (e.target.value.length > 2) {
        e.target.closest('form').submit();
      }
    }, 500);
  });
}

// Confirmation de suppression avec animation
const deleteForms = document.querySelectorAll('form[onsubmit*="confirm"]');
deleteForms.forEach(form => {
  const originalOnsubmit = form.onsubmit;
  form.onsubmit = (e) => {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
      }
      return true;
    }
    return false;
  };
});

// Tooltips personnalisés
const tooltips = document.querySelectorAll('[title]');
tooltips.forEach(element => {
  element.addEventListener('mouseenter', (e) => {
    const title = element.getAttribute('title');
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50';
    tooltip.textContent = title;
    tooltip.style.top = (e.clientY - 30) + 'px';
    tooltip.style.left = (e.clientX + 10) + 'px';
    document.body.appendChild(tooltip);
    
    element.addEventListener('mouseleave', () => {
      tooltip.remove();
    });
  });
});

// Console styling
console.log('%c🚀 Application démarrée avec succès!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%c✨ Design moderne et élégant', 'color: #48bb78; font-size: 14px;');