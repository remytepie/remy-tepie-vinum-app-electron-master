import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { EmplacementCreateInput, EmplacementRecord, EmplacementUpdateInput } from "src/shared/emplacement";

function toNumberOrNull(value?: string | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function formatDecimal(value: any): string | null {
  if (value === null || value === undefined) return null;
  return `${value}`;
}

export class EmplacementRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  private mapRecord(e: any): EmplacementRecord {
    return {
      id: e.id,
      nom: e.libelle,
      type: "Autre",
      capacite: null,
      temperature: formatDecimal(e.temperature),
      humidite: formatDecimal(e.humidite),
      notes: e.notes ?? null,
    };
  }

  async getEmplacements(): Promise<EmplacementRecord[]> {
    const emplacements = await this.dbclient.emplacement.findMany({
      orderBy: { id: "asc" },
    });
    return emplacements.map((e) => this.mapRecord(e));
  }

  async addEmplacement(data: EmplacementCreateInput): Promise<EmplacementRecord> {
    const created = await this.dbclient.emplacement.create({
      data: {
        libelle: data.nom,
        temperature: toNumberOrNull(data.temperature),
        humidite: toNumberOrNull(data.humidite),
        notes: data.notes ?? null,
      },
    });

    return this.mapRecord(created);
  }

  async updateEmplacement(id: number, data: EmplacementUpdateInput): Promise<EmplacementRecord> {
    const updated = await this.dbclient.emplacement.update({
      where: { id },
      data: {
        libelle: data.nom,
        temperature: data.temperature !== undefined ? toNumberOrNull(data.temperature) : undefined,
        humidite: data.humidite !== undefined ? toNumberOrNull(data.humidite) : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
      },
    });

    return this.mapRecord(updated);
  }

  async deleteEmplacement(id: number): Promise<void> {
    await this.dbclient.emplacement.delete({ where: { id } });
  }
}
