import basedosdados as bd

# Defina o projeto do Google Cloud. Não é necessário se estiver apenas lendo dados.
bd.config.save("project_id", "meu-projeto-no-google-cloud")

# Baixar os dados da tabela. Os parâmetros dataset_id e table_id são únicos para cada tabela.
dataset_id = "br_me_rais"
table_id = "microdados_vinculos"

# Carregar o DataFrame direto da tabela na Base dos Dados
df = bd.read_table(dataset_id=dataset_id, table_id=table_id)

# Mostrar as primeiras linhas dos dados
print(df.head())

import requests

url = "https://basedosdados.org/dataset/c861330e-bca2-474d-9073-bc70744a1b23?table=18835b0d-233e-4857-b454-1fa34a81b4fa"
response = requests.get(url)

if response.status_code == 200:
    html_content = response.text
    print("Página carregada com sucesso!")
else:
    print(f"Erro ao acessar a página: {response.status_code}")

from bs4 import BeautifulSoup

soup = BeautifulSoup(html_content, 'html.parser')

# Para verificar o título da página
page_title = soup.title.string
print(f"Título da página: {page_title}")

