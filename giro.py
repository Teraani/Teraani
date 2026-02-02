from sqlalchemy import create_engine
import pandas as pd

# Conectando ao banco de dados (ajuste as credenciais conforme necessário)
engine = create_engine('oracle+psycopg2://C5SUPORTE:C5SUPORTE@host:port/consinco')

# Executando o SELECT e importando os dados
query = """
select a.obspedido,
       a.nroempresa,
       a.nropedvenda,
       b.numerodf,
       a.situacaoped,
       a.codgeraloper,
       a.seqpessoa,       
       b.vlrembinformado,
       b.qtdatendida,
       (b.vlrembinformado * b.qtdatendida) as valor_total,
       SUM(b.vlrembinformado * b.qtdatendida) OVER () as soma_total,
       a.usuinclusao             
  from mad_pedvenda a
  inner join mad_pedvendaitem b
  on b.nropedvenda = a.nropedvenda
  and a.nroempresa = b.nroempresa
  where a.obspedido = 'VENDAPP'
  and a.nroempresa = 101
  and a.dtainclusao >= '24-oct-2024'
"""

df = pd.read_sql(query, engine)

# Verificando o DataFrame
print(df.head())

