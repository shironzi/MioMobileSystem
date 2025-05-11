import {api} from "@/utils/apiClient";

// export default async function fetchSubjects(gradeLevel: string) {
//     // 2. Await the token
//     const token = await getToken();
//     if (!token) {
//         throw new Error("No session token found");
//     }
//
//     // 3. Encode your filter as a query param (instead of sending a GET body)
//     const url = new URL("http://192.168.254.169:8001/api/subjects");
//     url.searchParams.append("gradeLevel", gradeLevel);
//
//     const response = await fetch(url.toString(), {
//         method: "GET",
//         headers: {
//             "Accept": "application/json",
//             "Authorization": `Bearer ${token}`,
//         },
//     });
//
//     if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//     }
//
//     return await response.json();
// }

export async function fetchSubjects(gradeLevel) {
    const { data } = await api.get('/subjects', {
        params: { gradeLevel },
    });

    return data;
}
