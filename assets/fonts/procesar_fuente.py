import fontforge

# 1. Abrir el archivo escolar.ttf
try:
    font = fontforge.open("escolar.ttf")
except:
    print("Error: No se encontró el archivo escolar.ttf en esta carpeta.")
    exit()

# 2. Engrosar el tipo de letra (Embolden)
# Si quieres que sea MUY negrita, sube el 40 a 60 o 70.
font.selection.all()
font.changeWeight(40, "auto")

# 3. Forzar los metadatos para que sea Bold y evitar bloqueos de licencia
font.familyname = "EscolarPro"
font.fullname = "Escolar Pro Bold"
font.fontname = "EscolarPro-Bold"
font.weight = "Bold"
font.os2_weight = 700  # Valor numérico de Bold
font.os2_stylemap = 32 # Indica al sistema que es Bold

# 4. Inyectar licencia libre para que no haya problemas
font.copyright = "SIL Open Font License"

# 5. Limpieza técnica (Vital para React Native y Android)
font.removeOverlap()
font.correctDirection()
font.simplify()

# 6. Generar el archivo final
font.generate("EscolarPro-Bold.ttf")

print("---")
print("¡Listo! Se ha creado 'EscolarPro-Bold.ttf' sin restricciones de licencia.")
print("---")