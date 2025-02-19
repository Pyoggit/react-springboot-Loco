import React, { useState, useEffect } from "react";
import axios from "@/utils/AxiosConfig";
import "@/css/admin/MemberManager.css";

const MemberManager = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [thName, setThName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // 관리자 페이지에서 모든 회원 정보를 불러옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admin_token"); // ✅ 관리자 토큰 가져오기
        if (!token) {
          console.error("🚨 관리자 토큰이 없습니다. 로그인 필요");
          return;
        }

        const response = await axios.get("/api/admin/members", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ 관리자 토큰 추가
          },
        });

        setMembers(response.data);
      } catch (error) {
        console.error("회원 정보 가져오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // ✅ 이메일 또는 이름으로 검색 가능하도록 수정
  const filteredMembers = members
    .filter(
      (member) =>
        member.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.userName.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ 이름 검색 추가
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field) => {
    const sortedMembers = [...members].sort((a, b) => {
      if (sortOrder === "asc") {
        return typeof a[field] === "number"
          ? a[field] - b[field]
          : a[field].localeCompare(b[field]);
      } else {
        return typeof a[field] === "number"
          ? b[field] - a[field]
          : b[field].localeCompare(a[field]);
      }
    });
    setMembers(sortedMembers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setThName(field);
  };

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    setCurrentPage(1);

    try {
      const response = await axios.get(
        `/api/admin/members/search?keyword=${keyword}`
      );
      setMembers(response.data);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  return (
    <div className="admin-member-container">
      <div className="admin-member-header">
        <input
          type="text"
          placeholder="이름 또는 이메일 검색"
          value={searchTerm}
          onChange={handleSearch}
          className="admin-member-search-input"
        />
        <button className="admin-member-delete-btn">삭제</button>
      </div>

      <table className="admin-member-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
              />
            </th>
            <th onClick={() => handleSort("userId")}>
              NO {thName === "userId" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("userEmail")}>
              이메일{" "}
              {thName === "userEmail" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("userName")}>
              이름{" "}
              {thName === "userName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("provider")}>
              로그인유형{" "}
              {thName === "provider" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>휴대폰 번호</th>
            <th>생년월일</th>
            <th onClick={() => handleSort("userRegDate")}>
              가입일{" "}
              {thName === "userRegDate"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member) => (
            <tr key={member.userEmail}>
              <td>
                <input
                  type="checkbox"
                  checked={member.checked || false}
                  onChange={() => {
                    const updatedMembers = members.map((m) =>
                      m.userEmail === member.userEmail
                        ? { ...m, checked: !m.checked }
                        : m
                    );
                    setMembers(updatedMembers);
                  }}
                />
              </td>
              <td>{member.userId}</td>
              <td>{member.userEmail}</td>
              <td>{member.userName}</td>
              <td>{member.provider}</td>
              <td>
                {member.mobile1 && member.mobile2 && member.mobile3
                  ? `${member.mobile1}-${member.mobile2}-${member.mobile3}`
                  : "없음"}
              </td>
              <td>{member.birth}</td>
              <td>
                {member.userRegDate
                  ? new Date(member.userRegDate).toLocaleDateString()
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberManager;
