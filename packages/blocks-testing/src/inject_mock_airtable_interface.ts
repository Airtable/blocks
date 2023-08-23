import VacantAirtableInterface from './vacant_airtable_interface';

const vacantAirtableInterface = new VacantAirtableInterface();

(window as any).__getAirtableInterfaceAtVersion = () => vacantAirtableInterface;
