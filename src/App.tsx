# === patch_ali.py === شغّل هذا الملف في نفس المجلد مع ali.py ===
import re

with open('ali.py', 'r', encoding='utf-8') as f:
    code = f.read()

# ══════════════════════════════════════════════════════════════
# FIX 1: Replace placehold.co with Pollinations.ai (real AI images)
# ══════════════════════════════════════════════════════════════
code = code.replace(
    'return f"https://placehold.co/{width}x{height}/1e40af/white?text={urllib.parse.quote(safe[:30])}"',
    'return f"https://image.pollinations.ai/prompt/{encoded}?width={width}&height={height}&nologo=true&seed={random.randint(1,99999)}"'
)

# ══════════════════════════════════════════════════════════════
# FIX 2: Expand AUTO_COLORS with bg_light, text_dark, card_bg, badge_bg
# ══════════════════════════════════════════════════════════════
code = code.replace(
    '"skincare":  {"primary":"#be185d","secondary":"#fdf2f8","accent":"#f59e0b","gradient1":"#be185d","gradient2":"#ec4899"},',
    '"skincare":  {"primary":"#be185d","secondary":"#fdf2f8","accent":"#f59e0b","gradient1":"#be185d","gradient2":"#ec4899","bg_light":"#fff5f8","text_dark":"#4a0e2b","card_bg":"#fff0f5","badge_bg":"#fce7f3"},'
)
code = code.replace(
    '"cosmetics": {"primary":"#0f766e","secondary":"#f0fdfa","accent":"#eab308","gradient1":"#0f766e","gradient2":"#14b8a6"},',
    '"cosmetics": {"primary":"#0f766e","secondary":"#f0fdfa","accent":"#eab308","gradient1":"#0f766e","gradient2":"#14b8a6","bg_light":"#f0fdfa","text_dark":"#064e47","card_bg":"#ecfdf5","badge_bg":"#d1fae5"},'
)
code = code.replace(
    '"health":    {"primary":"#15803d","secondary":"#f0fdf4","accent":"#f97316","gradient1":"#15803d","gradient2":"#22c55e"},',
    '"health":    {"primary":"#15803d","secondary":"#f0fdf4","accent":"#f97316","gradient1":"#15803d","gradient2":"#22c55e","bg_light":"#f0fdf4","text_dark":"#0a3d1c","card_bg":"#ecfdf5","badge_bg":"#dcfce7"},'
)
code = code.replace(
    '"gadgets":   {"primary":"#1e3a5f","secondary":"#f0f4f8","accent":"#ef4444","gradient1":"#1e3a5f","gradient2":"#3b82f6"},',
    '"gadgets":   {"primary":"#1e3a5f","secondary":"#f0f4f8","accent":"#ef4444","gradient1":"#1e3a5f","gradient2":"#3b82f6","bg_light":"#eff6ff","text_dark":"#0f1f33","card_bg":"#e8f0fe","badge_bg":"#dbeafe"},'
)
code = code.replace(
    '"fashion":   {"primary":"#7c2d12","secondary":"#fef3c7","accent":"#d97706","gradient1":"#7c2d12","gradient2":"#ea580c"},',
    '"fashion":   {"primary":"#7c2d12","secondary":"#fef3c7","accent":"#d97706","gradient1":"#7c2d12","gradient2":"#ea580c","bg_light":"#fffbeb","text_dark":"#451a0a","card_bg":"#fef3c7","badge_bg":"#fde68a"},'
)
code = code.replace(
    '"default":   {"primary":"#1e40af","secondary":"#eff6ff","accent":"#f59e0b","gradient1":"#1e40af","gradient2":"#3b82f6"},',
    '"default":   {"primary":"#1e40af","secondary":"#eff6ff","accent":"#f59e0b","gradient1":"#1e40af","gradient2":"#3b82f6","bg_light":"#eff6ff","text_dark":"#0f1f55","card_bg":"#e8f0fe","badge_bg":"#dbeafe"},'
)

# ══════════════════════════════════════════════════════════════
# FIX 3: Update build_lp_html to use new color tokens
# ══════════════════════════════════════════════════════════════
code = code.replace(
    '''    p=colors["primary"]; s=colors["secondary"]; a=colors["accent"]
    g1=colors["gradient1"]; g2=colors["gradient2"]''',
    '''    p=colors["primary"]; s=colors["secondary"]; a=colors["accent"]
    g1=colors["gradient1"]; g2=colors["gradient2"]
    bg_l=colors.get("bg_light","#f8fafc"); td=colors.get("text_dark","#1a1a2e")
    card_bg=colors.get("card_bg","#f0f4ff"); badge_bg=colors.get("badge_bg","#e0e7ff")'''
)

# ══════════════════════════════════════════════════════════════
# FIX 4: Professional CSS - Replace key CSS blocks
# ══════════════════════════════════════════════════════════════

# Add animations at top of CSS
code = code.replace(
    "body{font-family:'Cairo',sans-serif;direction:rtl;text-align:right;color:#333;background:#f8fafc;",
    "body{font-family:'Cairo',sans-serif;direction:rtl;text-align:right;color:#333;background:{bg_l};"
)

# Better topbar with glassmorphism
code = code.replace(
    '.topbar{background:{p};',
    '.topbar{background:linear-gradient(135deg,{td},{p});'
)
code = code.replace(
    ".tb{background:rgba(255,255,255,.15);",
    ".tb{background:rgba(255,255,255,.2);backdrop-filter:blur(10px);"
)

# Animated hero with gradient overlay
code = code.replace(
    '.hero{background:linear-gradient(135deg,{p},{g2});',
    '.hero{background:linear-gradient(160deg,{td} 0%,{p} 50%,{g2} 100%);'
)

# Floating hero person animation
code = code.replace(
    '.hero-person{flex:0 0 260px;max-width:260px;height:380px;object-fit:cover;border-radius:20px;box-shadow:0 15px 50px rgba(0,0,0,.3);border:3px solid rgba(255,255,255,.15);}',
    '.hero-person{flex:0 0 260px;max-width:260px;height:380px;object-fit:cover;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.3);border:3px solid rgba(255,255,255,.15);animation:float 4s ease-in-out infinite;}'
)

# Add animation keyframes after the body CSS rule
code = code.replace(
    "img{max-width:100%;height:auto;display:block;}",
    """img{max-width:100%;height:auto;display:block;}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}"""
)

# Better section backgrounds using dynamic colors
code = code.replace(
    '.sec{padding:50px 0;background:#fff;}',
    '.sec{padding:60px 0;background:{bg_l};animation:fadeInUp .6s ease;}'
)
code = code.replace(
    '.sec-color{padding:50px 0;background:{s};}',
    '.sec-color{padding:60px 0;background:{card_bg};}'
)
code = code.replace(
    '.sec-dark{padding:50px 0;background:linear-gradient(135deg,#0f172a,{p});color:#fff;}',
    '.sec-dark{padding:60px 0;background:linear-gradient(135deg,{td} 0%,{p} 100%);color:#fff;}'
)

# Better section title with decorative underline
code = code.replace(
    '.sec-title{text-align:center;font-size:1.5rem;font-weight:900;margin-bottom:30px;color:inherit;}',
    '.sec-title{text-align:center;font-size:1.6rem;font-weight:900;margin-bottom:35px;color:inherit;position:relative;padding-bottom:15px;}'
)

# Professional button with shine animation
code = code.replace(
    '.btn{display:inline-block;background:{a};color:#fff;padding:16px 40px;border-radius:12px;font-weight:800;font-size:1.1rem;text-align:center;cursor:pointer;transition:all .3s;box-shadow:0 6px 25px {a}44;}',
    '.btn{display:inline-block;background:linear-gradient(135deg,{a},{p});color:#fff;padding:16px 40px;border-radius:14px;font-weight:800;font-size:1.1rem;text-align:center;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 8px 30px {p}44;position:relative;overflow:hidden;}'
)
code = code.replace(
    '.btn:hover{transform:translateY(-2px);box-shadow:0 10px 35px {a}66;}',
    '.btn:hover{transform:translateY(-3px);box-shadow:0 12px 40px {p}66;}'
)

# Better cards with hover effects
code = code.replace(
    '.feat-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:all .3s;}',
    '.feat-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 6px 25px rgba(0,0,0,.06);transition:all .3s;border:1px solid rgba(0,0,0,.04);}'
)
code = code.replace(
    '.feat-card:hover{transform:translateY(-4px);box-shadow:0 10px 35px rgba(0,0,0,.12);}',
    '.feat-card:hover{transform:translateY(-5px);box-shadow:0 12px 40px '+'{p}22;}'
)

code = code.replace(
    '.ing-card{background:#fff;border-radius:16px;overflow:hidden;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:all .3s;}',
    '.ing-card{background:#fff;border-radius:20px;overflow:hidden;text-align:center;box-shadow:0 6px 25px rgba(0,0,0,.06);transition:all .3s;border:1px solid rgba(0,0,0,.04);}'
)

# Better FAQ with accordion style
code = code.replace(
    '.faq-item{border-bottom:1px solid #e5e7eb;padding:15px 0;}',
    '.faq-item{border:1px solid rgba(0,0,0,.06);border-radius:14px;margin-bottom:10px;overflow:hidden;transition:all .3s;background:#fff;}'
)
code = code.replace(
    '.faq-item summary{font-weight:700;cursor:pointer;color:{p};font-size:.95rem;list-style:none;}',
    '.faq-item summary{font-weight:700;cursor:pointer;color:{p};font-size:.95rem;list-style:none;padding:16px 20px;transition:background .3s;}'
)
code = code.replace(
    '.faq-item p{padding:10px 0 0;color:#555;font-size:.88rem;line-height:1.6;}',
    '.faq-item p{padding:14px 20px;color:#555;font-size:.88rem;line-height:1.7;}'
)

# Better pricing box
code = code.replace(
    '.price-box{text-align:center;background:linear-gradient(135deg,{s},#fff);padding:35px 20px;border-radius:20px;max-width:420px;margin:0 auto;box-shadow:0 10px 35px rgba(0,0,0,.1);border:2px solid {p}22;}',
    '.price-box{text-align:center;background:linear-gradient(135deg,#fff,{badge_bg});padding:40px 24px;border-radius:24px;max-width:440px;margin:0 auto;box-shadow:0 12px 45px rgba(0,0,0,.1);border:2px solid {p}15;position:relative;overflow:hidden;}'
)

# Pulsing discount tag
code = code.replace(
    '.dtag{background:#ef4444;color:#fff;padding:5px 18px;border-radius:20px;font-size:.88rem;font-weight:700;display:inline-block;}',
    '.dtag{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:6px 20px;border-radius:20px;font-size:.88rem;font-weight:700;display:inline-block;animation:pulse 2s infinite;}'
)

# Better guarantee box
code = code.replace(
    '.gbox{text-align:center;background:#f0fdf4;border:2px solid #22c55e;border-radius:18px;padding:28px;max-width:500px;margin:0 auto;}',
    '.gbox{text-align:center;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #22c55e;border-radius:24px;padding:32px;max-width:500px;margin:0 auto;box-shadow:0 8px 30px rgba(34,197,94,.1);}'
)

# Better final CTA
code = code.replace(
    '.final{background:linear-gradient(135deg,{g1},{g2});padding:50px 15px;text-align:center;color:#fff;}',
    '.final{background:linear-gradient(135deg,{g1},{p},{g2});padding:60px 15px;text-align:center;color:#fff;position:relative;overflow:hidden;}'
)

# Better doctor cards
code = code.replace(
    '.doc-card{display:flex;gap:18px;background:#fff;border-radius:16px;padding:22px;box-shadow:0 6px 25px rgba(0,0,0,.06);',
    '.doc-card{display:flex;gap:20px;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);border-radius:20px;padding:24px;box-shadow:0 8px 30px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.04);'
)

# Better review cards
code = code.replace(
    '.rev-card{background:rgba(255,255,255,.06);border-radius:16px;padding:22px;text-align:center;',
    '.rev-card{background:rgba(255,255,255,.08);backdrop-filter:blur(10px);border-radius:20px;padding:24px;text-align:center;border:1px solid rgba(255,255,255,.1);transition:all .3s;'
)

# Better trust badges with hover
code = code.replace(
    '.trust-badge{background:rgba(255,255,255,.1);color:#fff;padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:600;}',
    '.trust-badge{background:rgba(255,255,255,.12);backdrop-filter:blur(8px);color:#fff;padding:5px 14px;border-radius:20px;font-size:.78rem;font-weight:600;border:1px solid rgba(255,255,255,.1);transition:all .3s ease;}'
)

# ══════════════════════════════════════════════════════════════
# FIX 5: Improved YouCan JSON export with images + SEO
# ══════════════════════════════════════════════════════════════
code = code.replace(
    '''def generate_youcan_json(html):
    """Wrap HTML in YouCan-compatible page JSON format"""
    import json as _json
    yc_html = get_youcan_html(html)
    page_json = {
        "sections": [
            {
                "id": "custom_html_1",
                "type": "custom_html",
                "settings": {
                    "html": yc_html
                }
            }
        ]
    }
    return _json.dumps(page_json, ensure_ascii=False, indent=2)''',
    '''def generate_youcan_json(html, data=None, image_map=None):
    """Export full YouCan-compatible JSON with images, SEO, and page metadata"""
    import json as _json
    yc_html = get_youcan_html(html)
    images = []
    if image_map:
        for key, val in image_map.items():
            images.append({"id": key, "src": val, "alt": key.replace("IMG_","").replace("_"," ").lower()})
    page_json = {
        "page": {
            "title": data.get('hero_headline', 'Landing Page') if data else 'Landing Page',
            "meta_description": data.get('hero_subheadline', '') if data else '',
            "slug": "landing-page"
        },
        "sections": [
            {
                "id": "custom_landing_page",
                "type": "custom_html",
                "settings": {
                    "html": yc_html,
                    "full_width": True
                }
            }
        ],
        "images": images,
        "seo": {
            "title": data.get('hero_headline', '') if data else '',
            "description": data.get('hero_subheadline', '') if data else ''
        }
    }
    return _json.dumps(page_json, ensure_ascii=False, indent=2)'''
)

# ══════════════════════════════════════════════════════════════
# FIX 6: Update YouCan JSON calls to pass data + images
# ══════════════════════════════════════════════════════════════
code = code.replace(
    'st.download_button("\U0001f4e5 \u062a\u062d\u0645\u064a\u0644 YouCan JSON", generate_youcan_json(src), "youcan_page.lp", "application/json", key="yc_json_dl")',
    'st.download_button("\U0001f4e5 \u062a\u062d\u0645\u064a\u0644 YouCan JSON", generate_youcan_json(src, data=st.session_state.get(\'lp_data\'), image_map=st.session_state.get(\'lp_ai_images\')), "youcan_page.lp", "application/json", key="yc_json_dl")'
)

# ══════════════════════════════════════════════════════════════
# SAVE
# ══════════════════════════════════════════════════════════════
with open('ali.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("\u2705 Done! ali.py has been patched successfully.")
print("Changes applied:")
print("  1. Real AI images via Pollinations.ai (no more placeholders)")
print("  2. Extended color palettes per product category")
print("  3. Professional CSS with animations, glassmorphism, hover effects")
print("  4. Enhanced YouCan JSON export with images + SEO metadata")
print("  5. Deep Research & Calculator sections: UNCHANGED")
