const generateEventValidationPrompt = (eventData) => {
    return `
ANALISIS VALIDASI EVENT BUDAYA INDONESIA

TUGAS: Analisis konten event untuk validasi dengan fokus pada SARA, relevansi budaya, dan kualitas konten.

EVENT DATA:
Nama Event: ${eventData.name || 'N/A'}
Deskripsi: ${eventData.description || 'N/A'}
Kategori: ${eventData.types ? eventData.types.join(', ') : 'N/A'}
Lokasi: ${eventData.place_name || 'N/A'}
Waktu: ${eventData.start_datetime ? new Date(eventData.start_datetime).toLocaleDateString('id-ID') : 'N/A'} - ${eventData.end_datetime ? new Date(eventData.end_datetime).toLocaleDateString('id-ID') : 'N/A'}

INSTRUKSI ANALISIS:

1. SARA CONTENT CHECK (Suku, Agama, Ras, dan Antar-golongan):
   - Identifikasi kata-kata atau frasa yang berpotensi diskriminatif
   - Analisis konteks penggunaan kata-kata terkait SARA
   - Evaluasi apakah konten mempromosikan kesatuan atau perpecahan
   - Periksa sensitivitas budaya dan inklusivitas

2. CULTURAL RELEVANCE CHECK:
   - Evaluasi keterkaitan dengan budaya Indonesia
   - Periksa akurasi informasi budaya
   - Analisis nilai warisan budaya
   - Cek relevansi regional dan lokal

3. CONTENT QUALITY ASSESSMENT:
   - Evaluasi kejelasan dan kelengkapan informasi
   - Periksa profesionalisme dan struktur konten
   - Analisis akurasi informasi yang disampaikan
   - Cek konsistensi dengan kategori event

4. APPROPRIATENESS EVALUATION:
   - Periksa kesesuaian konten untuk semua umur
   - Evaluasi kesopanan dan penghormatan budaya
   - Analisis keamanan dan keselamatan konten
   - Cek kesesuaian dengan nilai-nilai Indonesia

SCORING SYSTEM:
- POSITIF (0.8-1.0): Konten sangat baik, aman, dan relevan
- NETRAL (0.6-0.79): Konten cukup baik, perlu review manual
- NEGATIF (0.0-0.59): Konten bermasalah, perlu ditolak

KELUARAN YANG DIMINTA (JSON FORMAT):

{
  "saraAnalysis": {
    "score": 0.95,
    "status": "POSITIF",
    "reasoning": "Konten fokus pada promosi budaya tanpa elemen diskriminatif",
    "detectedKeywords": [],
    "saraFlags": {
      "suku": { "detected": false, "keywords": [], "context": "Tidak ada referensi diskriminatif suku" },
      "agama": { "detected": false, "keywords": [], "context": "Tidak ada referensi diskriminatif agama" },
      "ras": { "detected": false, "keywords": [], "context": "Tidak ada referensi diskriminatif ras" },
      "antarGolongan": { "detected": false, "keywords": [], "context": "Tidak ada referensi diskriminatif golongan" }
    },
    "culturalSensitivity": "Tinggi",
    "inclusivity": "Baik"
  },
  "culturalRelevance": {
    "score": 0.92,
    "status": "POSITIF",
    "reasoning": "Event sangat relevan dengan budaya Indonesia",
    "indonesianElements": ["batik", "tradisional", "Solo", "warisan"],
    "regionalAccuracy": "Tinggi",
    "heritageValue": "Signifikan",
    "localAuthenticity": "Terverifikasi"
  },
  "contentQuality": {
    "score": 0.88,
    "status": "POSITIF",
    "reasoning": "Konten jelas, lengkap, dan profesional",
    "clarity": "Tinggi",
    "completeness": "Baik",
    "professionalism": "Tinggi",
    "accuracy": "Tinggi"
  },
  "appropriateness": {
    "score": 0.90,
    "status": "POSITIF",
    "reasoning": "Konten sesuai untuk semua umur dan menghormati budaya",
    "safety": "Aman",
    "respectfulness": "Tinggi",
    "culturalSensitivity": "Tinggi",
    "ageAppropriateness": "Semua umur"
  },
  "overallAssessment": {
    "score": 0.91,
    "status": "POSITIF",
    "recommendation": "auto_approve",
    "confidence": 0.95
  },
  "warnings": [],
  "suggestions": [
    "Pertimbangkan menambahkan detail workshop yang lebih spesifik",
    "Sertakan informasi harga jika ada"
  ],
  "flags": {
    "saraFlag": false,
    "qualityFlag": false,
    "culturalFlag": false,
    "safetyFlag": false
  }
}

CATATAN PENTING:
- Selalu berikan reasoning yang jelas dan spesifik
- Jika ada elemen SARA yang terdeteksi, jelaskan konteksnya
- Berikan warning jika ada potensi masalah
- Scoring harus konsisten: POSITIF (0.8-1.0), NETRAL (0.6-0.79), NEGATIF (0.0-0.59)
- Jika score di bawah 0.6, berikan alasan penolakan yang jelas
- Jika ada konten yang ambigu, rekomendasikan review manual

ANALISIS KONTEN BERIKUT:
`;
};

const generateEventUpdateValidationPrompt = (originalEvent, updatedEvent) => {
    return `
ANALISIS VALIDASI UPDATE EVENT BUDAYA INDONESIA

TUGAS: Analisis perubahan konten event untuk validasi dengan fokus pada dampak terhadap SARA, budaya, dan kualitas.

EVENT ASLI:
Nama: ${originalEvent.name || 'N/A'}
Deskripsi: ${originalEvent.description || 'N/A'}
Kategori: ${originalEvent.types ? originalEvent.types.join(', ') : 'N/A'}
Status: ${originalEvent.status || 'N/A'}

PERUBAHAN EVENT:
Nama: ${updatedEvent.name || 'N/A'}
Deskripsi: ${updatedEvent.description || 'N/A'}
Kategori: ${updatedEvent.types ? updatedEvent.types.join(', ') : 'N/A'}

INSTRUKSI ANALISIS:

1. PERBANDINGAN SARA CONTENT:
   - Bandingkan konten asli vs konten baru
   - Identifikasi perubahan yang mempengaruhi SARA
   - Evaluasi apakah perubahan memperbaiki atau memperburuk sensitivitas

2. PERUBAHAN CULTURAL RELEVANCE:
   - Analisis dampak perubahan terhadap relevansi budaya
   - Evaluasi apakah perubahan meningkatkan atau menurunkan nilai budaya
   - Periksa konsistensi dengan kategori event

3. PERUBAHAN CONTENT QUALITY:
   - Bandingkan kualitas konten sebelum dan sesudah
   - Evaluasi apakah perubahan meningkatkan kejelasan dan kelengkapan
   - Analisis dampak terhadap profesionalisme

4. APPROPRIATENESS CHANGES:
   - Evaluasi dampak perubahan terhadap kesesuaian konten
   - Periksa apakah perubahan mempengaruhi keselamatan atau kesopanan
   - Analisis dampak terhadap sensitivitas budaya

SCORING SYSTEM:
- POSITIF (0.8-1.0): Perubahan memperbaiki kualitas
- NETRAL (0.6-0.79): Perubahan netral, perlu review
- NEGATIF (0.0-0.59): Perubahan memperburuk kualitas

KELUARAN YANG DIMINTA (JSON FORMAT):

{
  "changeAnalysis": {
    "saraImpact": {
      "score": 0.95,
      "status": "POSITIF",
      "reasoning": "Perubahan tidak mempengaruhi elemen SARA",
      "improvements": [],
      "concerns": []
    },
    "culturalImpact": {
      "score": 0.88,
      "status": "POSITIF", 
      "reasoning": "Perubahan meningkatkan relevansi budaya",
      "improvements": ["Menambah detail budaya"],
      "concerns": []
    },
    "qualityImpact": {
      "score": 0.85,
      "status": "POSITIF",
      "reasoning": "Perubahan meningkatkan kualitas konten",
      "improvements": ["Informasi lebih lengkap"],
      "concerns": []
    }
  },
  "overallChangeAssessment": {
    "score": 0.89,
    "status": "POSITIF",
    "recommendation": "auto_approve",
    "reasoning": "Perubahan secara keseluruhan memperbaiki kualitas event"
  },
  "warnings": [],
  "suggestions": [
    "Pertimbangkan menambahkan detail lokasi yang lebih spesifik"
  ]
}

ANALISIS PERUBAHAN KONTEN BERIKUT:
`;
};

module.exports = {
    generateEventValidationPrompt,
    generateEventUpdateValidationPrompt
}; 