# Styling conventions

- Use Ant Design theme tokens in theme.js for library-wide appearance.
- Use AppButton with primary, info, secondary or success intent for branded actions.
- Use colocated CSS Modules for page layout. Do not target AntD internal classes or child markup.
- Keep inline styles for values calculated at runtime and sizing props passed to canvas/video components.
- GlobalStyles.js retains game constants and styles still consumed outside React pages.
- Preserve default library focus, hover and disabled behavior.

Static React page styles live in CSS Modules; runtime sizes and optional caller-provided styles remain inline.
