// --- Ambil Elemen DOM ---
const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');

// --- State Variabel ---
let currentInput = '0';
let calculationHistory = '';

// --- Fungsi Update Tampilan ---
function updateDisplay() {
    displayElement.innerText = currentInput;
    historyElement.innerText = calculationHistory;
}

// --- 1. Fungsi Tombol Angka ---
function appendNumber(number) {
    // Cegah input titik desimal ganda
    if (number === '.' && currentInput.includes('.')) return;
    
    // Jika layar saat ini '0' atau 'Error', ganti dengan angka baru
    if (currentInput === '0' || currentInput === 'Error') {
        if (number === '.') {
            currentInput = '0.';
        } else {
            currentInput = number;
        }
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// --- 2. Fungsi Tombol Operator ---
function appendOperator(operator) {
    // Jika layar menunjukkan Error, jangan izinkan input operator
    if (currentInput === 'Error') return;

    const lastChar = currentInput.slice(-1);
    const operators = ['+', '-', '*', '/', '%'];
    
    // Cegah operator berurutan (misal: ++ atau +*)
    if (operators.includes(lastChar) && operators.includes(operator)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } 
    // Logika khusus untuk kuadrat (x²)
    else if (operator === '**2') {
        currentInput = `(${currentInput})**2`;
    } 
    // Logika normal
    else {
        currentInput += operator;
    }
    updateDisplay();
}

// --- 3. Fungsi Clear (C) ---
function clearAll() {
    currentInput = '0';
    calculationHistory = '';
    updateDisplay();
}

// --- 4. Fungsi Hapus Karakter (Backspace) ---
function deleteLast() {
    if (currentInput === 'Error') {
        clearAll();
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
        // Jika yang tersisa hanya '-', kembalikan ke '0'
        if (currentInput === '-') currentInput = '0';
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// --- 5. Fungsi Hitung Hasil (=) ---
function calculate() {
    // Jika masih '0' atau 'Error', tidak perlu menghitung
    if (currentInput === '0' || currentInput === 'Error') return;

    try {
        // Simpan ekspresi asli untuk riwayat
        const expression = currentInput;
        
        // Validasi Pembagian Nol
        // Mengecek pola seperti "/0" diikuti oleh akhir string atau operator
        if (/\/0(?![.0-9])/.test(expression)) {
            throw new Error("Tidak bisa membagi dengan nol!");
        }

        // Mengganti simbol tampilan ke simbol JavaScript yang valid
        let evalString = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        // Evaluasi menggunakan Function (lebih aman daripada eval langsung)
        let result = new Function('return ' + evalString)();

        // Cek jika hasil Infinity atau NaN (Not a Number)
        if (!isFinite(result) || isNaN(result)) {
            throw new Error("Kesalahan Matematika");
        }

        // Format hasil: batasi maksimal 8 angka di belakang koma untuk menghindari error floating point
        result = parseFloat(result.toFixed(8));

        // Simpan ke riwayat
        calculationHistory = expression + ' =';
        currentInput = result.toString();
        
        updateDisplay();

    } catch (error) {
        // Tampilkan pesan error di layar
        currentInput = 'Error';
        calculationHistory = error.message;
        updateDisplay();
        
        // Reset otomatis setelah 2 detik
        setTimeout(() => {
            if(currentInput === 'Error') clearAll();
        }, 2000);
    }
}

// --- Inisialisasi Awal ---
updateDisplay();