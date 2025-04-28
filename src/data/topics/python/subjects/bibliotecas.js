export default {
  id: "bibliotecas",
  name: "Bibliotecas Essenciais",
  content: `# Bibliotecas Essenciais em Python

## NumPy

Biblioteca para computação numérica em Python.

\`\`\`python
import numpy as np

# Criar um array
arr = np.array([1, 2, 3, 4, 5])

# Operações vetorizadas
print(arr * 2)  # [2, 4, 6, 8, 10]
\`\`\`

## Pandas

Biblioteca para manipulação e análise de dados.

\`\`\`python
import pandas as pd

# Criar um DataFrame
df = pd.DataFrame({
    "A": [1, 2, 3],
    "B": ["a", "b", "c"]
})

# Filtrar dados
print(df[df["A"] > 1])
\`\`\``
};
