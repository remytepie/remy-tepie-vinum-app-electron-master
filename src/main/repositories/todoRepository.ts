import Todo from "src/shared/todo";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";

export class TodoRepository {
  private dbclient: PrismaClient;
  constructor() {
    let adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  private parseDetails(raw: string | null): Pick<Todo, "description" | "producer" | "region"> {
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        const result: Pick<Todo, "description" | "producer" | "region"> = {};

        if (typeof parsed.description === "string" && parsed.description.trim().length > 0) {
          result.description = parsed.description;
        }

        if (typeof parsed.producer === "string" && parsed.producer.trim().length > 0) {
          result.producer = parsed.producer;
        }

        if (typeof parsed.region === "string" && parsed.region.trim().length > 0) {
          result.region = parsed.region;
        }

        return result;
      }
    } catch {
      // fall through to return legacy description string
    }

    return { description: raw };
  }

  private serializeDetails(todo: Todo): string | null {
    const normalized = (value?: string | null) => {
      if (typeof value !== "string") {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const payload: Record<string, string> = {};

    const description = normalized(todo.description);
    const producer = normalized(todo.producer);
    const region = normalized(todo.region);

    if (description) {
      payload.description = description;
    }

    if (producer) {
      payload.producer = producer;
    }

    if (region) {
      payload.region = region;
    }

    return Object.keys(payload).length ? JSON.stringify(payload) : null;
  }

  async getTodos(): Promise<Todo[]> {
    let todos = await this.dbclient.todos.findMany({
      include: {
        todo_tags: {
          include: {
            tags: true,
          },
        }
      }
    });

    return todos.map((t) => {
      const details = this.parseDetails(t.description);

      return {
        id: t.id,
        title: t.title,
        ...details,
        dateLimite: t.due_date,
        isFinished: t.is_finished,
        tags: t.todo_tags.map((tt) => tt.tags.name),
      } as Todo;
    });
  }

  async addTodo(todo: Todo): Promise<void> {
    await this.dbclient.todos.create({
      data: {
        id: 0,
        title: todo.title,
        description: this.serializeDetails(todo),
        due_date: todo.dateLimite,
        is_finished: todo.isFinished,
      },
    });
  }

  async deleteTodo(id: number): Promise<void> {
    await this.dbclient.todos.delete({
      where: {
        id: id,
      },
    });
  }

  async toggleTodo(id: number): Promise<void> {
    let todo = await this.dbclient.todos.findUnique({
      where: {
        id: id,
      },
    });

    await this.dbclient.todos.update({
      where: {
        id: id,
      },
      data: {
        is_finished: {
          set: !todo.is_finished,
        },
      },
    });
  }
}
