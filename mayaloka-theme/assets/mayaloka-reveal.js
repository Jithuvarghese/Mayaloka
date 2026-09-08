document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.mayaloka-section .mayaloka-reveal, .mayaloka-reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
});
