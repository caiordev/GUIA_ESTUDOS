export default {
  id: "poo",
  name: "Programação Orientada a Objetos",
  content: `# Java - Programação Orientada a Objetos

## Classes e Objetos

Uma classe é um modelo para criar objetos, e um objeto é uma instância de uma classe.

\`\`\`java
// Definição de uma classe
public class Pessoa {
    // Atributos
    private String nome;
    private int idade;
    
    // Construtor
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Métodos
    public void apresentar() {
        System.out.println("Olá, meu nome é " + nome + " e tenho " + idade + " anos.");
    }
    
    // Getters e Setters
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public int getIdade() {
        return idade;
    }
    
    public void setIdade(int idade) {
        this.idade = idade;
    }
}

// Criando objetos
Pessoa pessoa1 = new Pessoa("João", 30);
Pessoa pessoa2 = new Pessoa("Maria", 25);

pessoa1.apresentar();  // Saída: Olá, meu nome é João e tenho 30 anos.
\`\`\`

## Encapsulamento

O encapsulamento é o conceito de esconder detalhes de implementação e expor apenas o necessário.

\`\`\`java
public class ContaBancaria {
    private double saldo;
    private String numeroConta;
    
    public ContaBancaria(String numeroConta, double saldoInicial) {
        this.numeroConta = numeroConta;
        this.saldo = saldoInicial;
    }
    
    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            System.out.println("Depósito de " + valor + " realizado.");
        } else {
            System.out.println("Valor inválido para depósito.");
        }
    }
    
    public void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
            System.out.println("Saque de " + valor + " realizado.");
        } else {
            System.out.println("Saldo insuficiente ou valor inválido.");
        }
    }
    
    public double getSaldo() {
        return saldo;
    }
    
    public String getNumeroConta() {
        return numeroConta;
    }
}
\`\`\`

## Herança

A herança permite que uma classe herde atributos e métodos de outra classe.

\`\`\`java
// Classe pai/base
public class Animal {
    protected String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void emitirSom() {
        System.out.println("Som genérico de animal");
    }
}

// Classe filha/derivada
public class Cachorro extends Animal {
    private String raca;
    
    public Cachorro(String nome, String raca) {
        super(nome);  // Chama o construtor da classe pai
        this.raca = raca;
    }
    
    // Sobrescrita de método
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
    
    // Método específico da classe Cachorro
    public void abanarRabo() {
        System.out.println(nome + " está abanando o rabo!");
    }
}

Cachorro rex = new Cachorro("Rex", "Labrador");
rex.emitirSom();  // Saída: Au au!
rex.abanarRabo();  // Saída: Rex está abanando o rabo!
\`\`\`

## Polimorfismo

O polimorfismo permite que objetos de diferentes classes sejam tratados como objetos de uma classe comum.

\`\`\`java
public class Gato extends Animal {
    public Gato(String nome) {
        super(nome);
    }
    
    @Override
    public void emitirSom() {
        System.out.println("Miau!");
    }
}

// Polimorfismo
Animal animal1 = new Cachorro("Rex", "Labrador");
Animal animal2 = new Gato("Felix");

animal1.emitirSom();  // Saída: Au au!
animal2.emitirSom();  // Saída: Miau!

// Array de animais
Animal[] animais = new Animal[3];
animais[0] = new Animal("Genérico");
animais[1] = new Cachorro("Rex", "Labrador");
animais[2] = new Gato("Felix");

for (Animal animal : animais) {
    animal.emitirSom();  // Chama o método apropriado para cada tipo
}
\`\`\`

## Abstração

A abstração permite criar classes e métodos abstratos que definem uma interface sem implementação.

\`\`\`java
// Classe abstrata
public abstract class Forma {
    // Método abstrato (sem implementação)
    public abstract double calcularArea();
    
    // Método concreto (com implementação)
    public void exibirArea() {
        System.out.println("Área: " + calcularArea());
    }
}

// Implementação concreta
public class Retangulo extends Forma {
    private double largura;
    private double altura;
    
    public Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
    }
    
    @Override
    public double calcularArea() {
        return largura * altura;
    }
}

public class Circulo extends Forma {
    private double raio;
    
    public Circulo(double raio) {
        this.raio = raio;
    }
    
    @Override
    public double calcularArea() {
        return Math.PI * raio * raio;
    }
}

Forma forma1 = new Retangulo(5, 10);
Forma forma2 = new Circulo(7);

forma1.exibirArea();  // Área: 50.0
forma2.exibirArea();  // Área: 153.93804002589985
\`\`\`

## Interfaces

As interfaces definem um contrato que as classes devem implementar.

\`\`\`java
// Definição de interface
public interface Nadador {
    void nadar();
}

public interface Voador {
    void voar();
}

// Implementação de múltiplas interfaces
public class Pato extends Animal implements Nadador, Voador {
    public Pato(String nome) {
        super(nome);
    }
    
    @Override
    public void emitirSom() {
        System.out.println("Quack!");
    }
    
    @Override
    public void nadar() {
        System.out.println(nome + " está nadando.");
    }
    
    @Override
    public void voar() {
        System.out.println(nome + " está voando.");
    }
}

Pato pato = new Pato("Donald");
pato.emitirSom();  // Quack!
pato.nadar();      // Donald está nadando.
pato.voar();       // Donald está voando.

// Polimorfismo com interfaces
Nadador nadador = new Pato("Patolino");
nadador.nadar();   // Patolino está nadando.
\`\`\`
`
};
