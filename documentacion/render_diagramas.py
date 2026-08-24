import base64, json, re, os, urllib.request

os.makedirs('img', exist_ok=True)
diagramas = []
nombres = ['fig1_er_base_datos', 'fig2_flujo_navegacion', 'fig3_arquitectura_capas',
           'fig4_secuencia_jwt', 'fig5_piramide_pruebas', 'fig6_despliegue_docker',
           'fig7_pipeline']

for archivo in ['04-modelado-diseno.md', '05-implementacion.md']:
    texto = open(archivo, encoding='utf-8').read()
    for m in re.finditer(r'```mermaid\n(.*?)```', texto, re.S):
        diagramas.append(m.group(1).strip())

print(f'Diagramas encontrados: {len(diagramas)}')

for i, codigo in enumerate(diagramas):
    estado = {"code": codigo, "mermaid": {"theme": "neutral"}}
    b64 = base64.urlsafe_b64encode(json.dumps(estado).encode()).decode()
    url = f'https://mermaid.ink/img/{b64}?type=png&width=1800&scale=2'
    destino = f'img/{nombres[i]}.png'
    peticion = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(peticion, timeout=60) as r, open(destino, 'wb') as f:
        f.write(r.read())
    print(f'{destino}  ({os.path.getsize(destino)//1024} KB)')
