-- ============================================
-- SEED DATA: KARNATAKA PUC & NCERT CURRICULUM
-- ============================================

-- Insert Subjects
insert into public.subjects (slug, name, name_kn, class_level, stream, board, has_lab, sort_order, active)
values
  -- PUC 2 Science
  ('puc2-physics', 'Physics', 'ಭೌತಶಾಸ್ತ್ರ', 'puc2', 'science', 'ktbs', true, 1, true),
  ('puc2-chemistry', 'Chemistry', 'ರಸಾಯನಶಾಸ್ತ್ರ', 'puc2', 'science', 'ktbs', true, 2, true),
  ('puc2-mathematics', 'Mathematics', 'ಗಣಿತ', 'puc2', 'science', 'ktbs', false, 3, true),
  ('puc2-biology', 'Biology', 'ಜೀವಶಾಸ್ತ್ರ', 'puc2', 'science', 'ktbs', true, 4, true),
  ('puc2-computer-science', 'Computer Science', 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ', 'puc2', 'science', 'ktbs', true, 5, true),

  -- PUC 2 Commerce
  ('puc2-accountancy', 'Accountancy', 'ಲೆಕ್ಕಪತ್ರ ಶಾಸ್ತ್ರ', 'puc2', 'commerce', 'ktbs', false, 10, true),
  ('puc2-business-studies', 'Business Studies', 'ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳು', 'puc2', 'commerce', 'ktbs', false, 11, true),
  ('puc2-economics', 'Economics', 'ಅರ್ಥಶಾಸ್ತ್ರ', 'puc2', 'commerce', 'ktbs', false, 12, true),
  ('puc2-statistics', 'Statistics', 'ಅಂಕಿಅಂಕಿಗಳು', 'puc2', 'commerce', 'ktbs', false, 13, true),

  -- PUC 1 Science
  ('puc1-physics', 'Physics', 'ಭೌತಶಾಸ್ತ್ರ', 'puc1', 'science', 'ktbs', true, 20, true),
  ('puc1-chemistry', 'Chemistry', 'ರಸಾಯನಶಾಸ್ತ್ರ', 'puc1', 'science', 'ktbs', true, 21, true),
  ('puc1-mathematics', 'Mathematics', 'ಗಣಿತ', 'puc1', 'science', 'ktbs', false, 22, true),
  ('puc1-biology', 'Biology', 'ಜೀವಶಾಸ್ತ್ರ', 'puc1', 'science', 'ktbs', true, 23, true),

  -- PUC 1 Commerce
  ('puc1-accountancy', 'Accountancy', 'ಲೆಕ್ಕಪತ್ರ ಶಾಸ್ತ್ರ', 'puc1', 'commerce', 'ktbs', false, 30, true),
  ('puc1-business-studies', 'Business Studies', 'ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳು', 'puc1', 'commerce', 'ktbs', false, 31, true),
  ('puc1-economics', 'Economics', 'ಅರ್ಥಶಾಸ್ತ್ರ', 'puc1', 'commerce', 'ktbs', false, 32, true),

  -- Languages (Common)
  ('puc2-english', 'English', 'ಇಂಗ್ಲಿಷ್', 'puc2', 'common', 'ktbs', false, 40, true),
  ('puc2-kannada', 'Kannada', 'ಕನ್ನಡ', 'puc2', 'common', 'ktbs', false, 41, true)
on conflict (slug) do nothing;

-- Insert 2nd PUC Physics Chapters
do $$
declare
  phy_id uuid;
  che_id uuid;
  mat_id uuid;
begin
  select id into phy_id from public.subjects where slug = 'puc2-physics';
  if phy_id is not null then
    insert into public.chapters (subject_id, number, slug, title, status)
    values
      (phy_id, 1, 'electric-charges-and-fields', 'Electric Charges and Fields', 'active'),
      (phy_id, 2, 'electrostatic-potential-and-capacitance', 'Electrostatic Potential and Capacitance', 'active'),
      (phy_id, 3, 'current-electricity', 'Current Electricity', 'active'),
      (phy_id, 4, 'moving-charges-and-magnetism', 'Moving Charges and Magnetism', 'active'),
      (phy_id, 5, 'magnetism-and-matter', 'Magnetism and Matter', 'active'),
      (phy_id, 6, 'electromagnetic-induction', 'Electromagnetic Induction', 'active'),
      (phy_id, 7, 'alternating-current', 'Alternating Current', 'active'),
      (phy_id, 8, 'electromagnetic-waves', 'Electromagnetic Waves', 'active'),
      (phy_id, 9, 'ray-optics-and-optical-instruments', 'Ray Optics and Optical Instruments', 'active'),
      (phy_id, 10, 'wave-optics', 'Wave Optics', 'active'),
      (phy_id, 11, 'dual-nature-of-radiation-and-matter', 'Dual Nature of Radiation and Matter', 'active'),
      (phy_id, 12, 'atoms', 'Atoms', 'active'),
      (phy_id, 13, 'nuclei', 'Nuclei', 'active'),
      (phy_id, 14, 'semiconductor-electronics', 'Semiconductor Electronics: Materials, Devices and Simple Circuits', 'active')
    on conflict (subject_id, number) do nothing;
  end if;

  select id into che_id from public.subjects where slug = 'puc2-chemistry';
  if che_id is not null then
    insert into public.chapters (subject_id, number, slug, title, status)
    values
      (che_id, 1, 'solutions', 'Solutions', 'active'),
      (che_id, 2, 'electrochemistry', 'Electrochemistry', 'active'),
      (che_id, 3, 'chemical-kinetics', 'Chemical Kinetics', 'active'),
      (che_id, 4, 'd-and-f-block-elements', 'The d- and f-Block Elements', 'active'),
      (che_id, 5, 'coordination-compounds', 'Coordination Compounds', 'active'),
      (che_id, 6, 'haloalkanes-and-haloarenes', 'Haloalkanes and Haloarenes', 'active'),
      (che_id, 7, 'alcohols-phenols-and-ethers', 'Alcohols, Phenols and Ethers', 'active'),
      (che_id, 8, 'aldehydes-ketones-and-carboxylic-acids', 'Aldehydes, Ketones and Carboxylic Acids', 'active'),
      (che_id, 9, 'amines', 'Amines', 'active'),
      (che_id, 10, 'biomolecules', 'Biomolecules', 'active')
    on conflict (subject_id, number) do nothing;
  end if;

  select id into mat_id from public.subjects where slug = 'puc2-mathematics';
  if mat_id is not null then
    insert into public.chapters (subject_id, number, slug, title, status)
    values
      (mat_id, 1, 'relations-and-functions', 'Relations and Functions', 'active'),
      (mat_id, 2, 'inverse-trigonometric-functions', 'Inverse Trigonometric Functions', 'active'),
      (mat_id, 3, 'matrices', 'Matrices', 'active'),
      (mat_id, 4, 'determinants', 'Determinants', 'active'),
      (mat_id, 5, 'continuity-and-differentiability', 'Continuity and Differentiability', 'active'),
      (mat_id, 6, 'application-of-derivatives', 'Application of Derivatives', 'active'),
      (mat_id, 7, 'integrals', 'Integrals', 'active'),
      (mat_id, 8, 'application-of-integrals', 'Application of Integrals', 'active'),
      (mat_id, 9, 'differential-equations', 'Differential Equations', 'active'),
      (mat_id, 10, 'vector-algebra', 'Vector Algebra', 'active'),
      (mat_id, 11, 'three-dimensional-geometry', 'Three Dimensional Geometry', 'active'),
      (mat_id, 12, 'linear-programming', 'Linear Programming', 'active'),
      (mat_id, 13, 'probability', 'Probability', 'active')
    on conflict (subject_id, number) do nothing;
  end if;
end $$;
