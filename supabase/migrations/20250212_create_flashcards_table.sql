-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists
DROP TABLE IF EXISTS flashcards CASCADE;

-- Create the flashcards table
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    module TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO flashcards (question, answer, module, difficulty)
VALUES
    -- Easy Flashcards
    ('What is oncology?', 'The branch of medicine that deals with the prevention, diagnosis, and treatment of cancer.', 'General Oncology', 'Easy'),
    ('What is the most common cancer worldwide?', 'Lung cancer.', 'Epidemiology', 'Easy'),
    ('What does TNM staging stand for?', 'Tumor, Nodes, Metastasis.', 'Staging', 'Easy'),
    ('What is chemotherapy?', 'A treatment method that uses drugs to kill cancer cells.', 'Treatment', 'Easy'),
    ('What are oncogenes?', 'Genes that, when mutated, can lead to cancer.', 'Genetics', 'Easy'),

    -- Medium Flashcards
    ('What is the first-line treatment for HER2-positive breast cancer?', 'Trastuzumab + Pertuzumab + Docetaxel.', 'Breast Cancer', 'Medium'),
    ('What is the mechanism of action of checkpoint inhibitors?', 'They block PD-1/PD-L1 or CTLA-4, preventing immune suppression.', 'Immunotherapy', 'Medium'),
    ('What is the function of tumor suppressor genes?', 'They regulate cell division and prevent uncontrolled growth.', 'Genetics', 'Medium'),
    ('How does BRCA1 mutation increase cancer risk?', 'It impairs DNA repair, leading to genomic instability.', 'Genetics', 'Medium'),
    ('Which chemotherapy drug is platinum-based?', 'Cisplatin.', 'Chemotherapy', 'Medium'),

    -- Hard Flashcards
    ('How does BCR-ABL1 fusion contribute to leukemia?', 'It creates a constitutively active tyrosine kinase, driving uncontrolled proliferation.', 'Leukemia', 'Hard'),
    ('What mutation is common in colorectal cancer?', 'KRAS, BRAF, APC mutations.', 'Colorectal Cancer', 'Hard'),
    ('What is the Warburg effect in cancer?', 'Cancer cells preferentially use glycolysis even in the presence of oxygen.', 'Metabolism', 'Hard'),
    ('How does p53 mutation contribute to tumor development?', 'Loss of p53 prevents apoptosis, allowing damaged cells to survive and proliferate.', 'Genetics', 'Hard'),
    ('What is the role of VEGF in tumor growth?', 'It promotes angiogenesis, allowing tumors to develop a blood supply.', 'Tumor Biology', 'Hard');

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_flashcard_modtime ON flashcards;
CREATE TRIGGER update_flashcard_modtime
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for common queries
CREATE INDEX idx_flashcards_module ON flashcards(module);
CREATE INDEX idx_flashcards_difficulty ON flashcards(difficulty);
