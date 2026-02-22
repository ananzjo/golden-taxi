/* ==================================================================
   [cars-logic.js] - المحرك البرمجي المعتمد
   الجدول المستهدف: t01_cars (تم التعديل حسب الأصول)
   ================================================================== */

// [1] جلب البيانات وعرضها
async function loadData() {
    const tableDiv = document.getElementById('tableContainer');
    
    // فحص الربط مع الجدول الجديد t01_cars
    const { data, error } = await _supabase
        .from('t01_cars') 
        .select('*')
        .order('f01_id', { ascending: false });

    if (error) {
        tableDiv.innerHTML = `<p style="color:var(--status-red); padding:20px;">خطأ في الوصول للجدول: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        tableDiv.innerHTML = `<p style="text-align:center; padding:30px; color:#888;">لا يوجد بيانات مسجلة في t01_cars.</p>`;
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>اللوحة | Plate</th>
                    <th>المكتب | Office</th>
                    <th>الموديل | Year</th>
                    <th>الحالة | Status</th>
                    <th>السائق | Driver</th>
                    <th style="text-align:center;">إجراءات</th>
                </tr>
            </thead>
            <tbody>`;

    data.forEach(car => {
        const statusClass = car.f12_is_active === 'نشط' ? 'bg-active' : 'bg-inactive';
        html += `
            <tr>
                <td><b>${car.f02_plate_no}</b></td>
                <td>${car.f03_car_office || '-'}</td>
                <td>${car.f06_model || '-'}</td>
                <td><span class="badge ${statusClass}">${car.f12_is_active}</span></td>
                <td>${car.f13_current_driver_id || 'شاغر'}</td>
                <td style="text-align:center;">
                    <button class="btn-edit" onclick='editCar(${JSON.stringify(car)})'>✏️</button>
                    <button class="btn-delete" onclick="deleteCar(${car.f01_id})">🗑️</button>
                </td>
            </tr>`;
    });

    html += `</tbody></table>`;
    tableDiv.innerHTML = html;
}

// [2] حفظ البيانات (الربط مع t01_cars)
async function saveData() {
    const id = document.getElementById('f01_id').value;

    const carData = {
        f02_plate_no: document.getElementById('f02_plate_no').value.trim(),
        f03_car_office: document.getElementById('f03_car_office').value.trim(),
        f04_brand: document.getElementById('f04_brand').value.trim(),
        f05_brand_type: document.getElementById('f05_brand_type').value.trim(),
        f06_model: parseInt(document.getElementById('f06_model').value) || null,
        f07_license_expiry: document.getElementById('f07_license_expiry').value || null,
        f08_standard_rent: parseFloat(document.getElementById('f08_standard_rent').value) || 0,
        f09_management_fee: parseFloat(document.getElementById('f09_management_fee').value) || 0,
        f10_responsible_staff_id: document.getElementById('f10_responsible_staff_id').value.trim(),
        f11_owner_id: document.getElementById('f11_owner_id').value.trim(),
        f12_is_active: document.getElementById('f12_is_active').value,
        f13_current_driver_id: document.getElementById('f13_current_driver_id').value.trim(),
        f14_car_notes: document.getElementById('f14_car_notes').value.trim(),
        f15_fuel_type: document.getElementById('f15_fuel_type').value
    };

    if (!carData.f02_plate_no) { alert("رقم اللوحة مطلوب!"); return; }

    const response = id 
        ? await _supabase.from('t01_cars').update(carData).eq('f01_id', id)
        : await _supabase.from('t01_cars').insert([carData]);

    if (response.error) {
        alert("فشل الحفظ: " + response.error.message);
    } else {
        alert("تمت العملية بنجاح ✅");
        resetForm();
        loadData();
    }
}

// دالات الحذف والتعديل تبقى كما هي مع تغيير اسم الجدول لـ t01_cars
async function deleteCar(id) {
    if (confirm("هل أنت متأكد؟")) {
        await _supabase.from('t01_cars').delete().eq('f01_id', id);
        loadData();
    }
}

function editCar(car) {
    // ملء الحقول f01 - f15
    document.getElementById('f01_id').value = car.f01_id;
    document.getElementById('f02_plate_no').value = car.f02_plate_no;
    // ... باقي الحقول بنفس النمط
    document.getElementById('saveBtn').textContent = "تحديث البيانات | Update";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('carForm').reset();
    document.getElementById('f01_id').value = "";
    document.getElementById('saveBtn').textContent = "حفظ البيانات | Save Data";
}