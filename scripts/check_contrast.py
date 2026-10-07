def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def relative_luminance(hex_str):
    hex_str = hex_str.lstrip('#')
    r, g, b = [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]
    return 0.2126 * srgb_to_linear(r) + 0.7152 * srgb_to_linear(g) + 0.0722 * srgb_to_linear(b)

def contrast_ratio(hex1, hex2):
    l1 = relative_luminance(hex1)
    l2 = relative_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

pairs = [
    ('#1f242d', '#f6f8fa', 'App Body Graphite on Surface Ground'),
    ('#1e3a8a', '#f6f8fa', 'App Ink Links / Secondary on Surface Ground'),
    ('#ffffff', '#1e3a8a', 'App White on Ink Interactive Button'),
    ('#ffffff', '#111111', 'App/Landing White on Primary Near-Black Button'),
    ('#525e75', '#f6f8fa', 'App Pencil Secondary Text on Surface Ground'),
    ('#b91c1c', '#f6f8fa', 'App Red Correction Pen on Surface Ground'),
    ('#1f242d', '#fef08a', 'App Graphite Sentence on Highlighter Swipe'),
    ('#ffffff', '#27272a', 'App White Text on Redaction Tape'),
    ('#ffffff', '#991b1b', 'App White Text on Danger Button'),
    ('#111111', '#FAFAF8', 'Landing Primary Text on Warm White Bg'),
    ('#666666', '#FAFAF8', 'Landing Muted Text on Warm White Bg'),
    ('#111111', '#FFFFFF', 'Landing Primary Text on Card Surface'),
    ('#666666', '#FFFFFF', 'Landing Muted Text on Card Surface'),
]

header = f"{'Foreground':<12} {'Background':<12} {'Ratio':<8} {'WCAG AA':<8} {'Role / Usage'}"
print(header)
print('-' * len(header) + '-' * 20)
for fg, bg, role in pairs:
    r = contrast_ratio(fg, bg)
    passed = 'PASS' if r >= 4.5 else 'FAIL'
    print(f"{fg:<12} {bg:<12} {r:5.2f}:1   {passed:<8} {role}")
