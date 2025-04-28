export default {
  id: "fundamentos",
  name: "Fundamentos",
  content: `# Java - Fundamentos

## O que é Java?

Java é uma linguagem de programação orientada a objetos, de alto nível, com sintaxe derivada de C e C++. Foi desenvolvida pela Sun Microsystems (agora pertencente à Oracle) e lançada em 1995.

## Características principais

- **Orientação a objetos**: Tudo em Java é um objeto (exceto tipos primitivos)
- **Independência de plataforma**: "Write once, run anywhere" (WORA)
- **Robustez**: Gerenciamento automático de memória, verificação de tipos em tempo de compilação
- **Segurança**: Execução em uma máquina virtual isolada (JVM)
- **Multithreading**: Suporte nativo para programação concorrente

## Instalação do JDK

### Ubuntu/Debian
\`\`\`bash
sudo apt update
sudo apt install openjdk-17-jdk
\`\`\`

### macOS (usando Homebrew)
\`\`\`bash
brew install openjdk@17
\`\`\`

### Verificar instalação
\`\`\`bash
java -version
javac -version
\`\`\`

## Primeiro programa em Java

\`\`\`java
// Arquivo: HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
    }
}
\`\`\`

### Compilar e executar
\`\`\`bash
javac HelloWorld.java
java HelloWorld
\`\`\`

## Tipos de dados primitivos

- **byte**: 8 bits, -128 a 127
- **short**: 16 bits, -32,768 a 32,767
- **int**: 32 bits, -2^31 a 2^31-1
- **long**: 64 bits, -2^63 a 2^63-1
- **float**: 32 bits, ponto flutuante
- **double**: 64 bits, ponto flutuante
- **char**: 16 bits, caractere Unicode
- **boolean**: true ou false

## Variáveis e constantes

\`\`\`java
// Declaração de variáveis
int idade = 25;
double salario = 3500.50;
char sexo = 'M';
boolean ativo = true;
String nome = "João Silva";  // String não é um tipo primitivo

// Constantes
final double PI = 3.14159;
\`\`\`

## Operadores

### Aritméticos
\`\`\`java
int a = 10, b = 3;
int soma = a + b;       // 13
int subtracao = a - b;  // 7
int multiplicacao = a * b;  // 30
int divisao = a / b;    // 3 (divisão inteira)
int resto = a % b;      // 1
\`\`\`

### Relacionais
\`\`\`java
boolean igual = (a == b);       // false
boolean diferente = (a != b);   // true
boolean maior = (a > b);        // true
boolean menor = (a < b);        // false
boolean maiorIgual = (a >= b);  // true
boolean menorIgual = (a <= b);  // false
\`\`\`

### Lógicos
\`\`\`java
boolean x = true, y = false;
boolean e = x && y;    // false (AND)
boolean ou = x || y;   // true (OR)
boolean nao = !x;      // false (NOT)
\`\`\`

## Estruturas de controle

### Condicional if-else
\`\`\`java
if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}
\`\`\`

### Switch
\`\`\`java
switch (diaDaSemana) {
    case 1:
        System.out.println("Domingo");
        break;
    case 2:
        System.out.println("Segunda-feira");
        break;
    // ...
    default:
        System.out.println("Dia inválido");
}
\`\`\`

### Loop for
\`\`\`java
for (int i = 0; i < 10; i++) {
    System.out.println("Contagem: " + i);
}
\`\`\`

### Loop while
\`\`\`java
int contador = 0;
while (contador < 5) {
    System.out.println("Contador: " + contador);
    contador++;
}
\`\`\`

### Loop do-while
\`\`\`java
int numero = 1;
do {
    System.out.println("Número: " + numero);
    numero *= 2;
} while (numero < 100);
\`\`\`

## Arrays

\`\`\`java
// Declaração e inicialização
int[] numeros = new int[5];
numeros[0] = 10;
numeros[1] = 20;

// Inicialização direta
String[] frutas = {"Maçã", "Banana", "Laranja"};

// Percorrendo array
for (int i = 0; i < frutas.length; i++) {
    System.out.println(frutas[i]);
}

// For-each (enhanced for)
for (String fruta : frutas) {
    System.out.println(fruta);
}
\`\`\`
`
};
