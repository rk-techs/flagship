export default function CustomerTable({ contacts }) {
  return (
    <div className="table-wrapper is-scrollable">
      <table className="table">
        <thead className="table-header">
          <tr className="table-row">
            <th className="th-cell col-fixed">ID</th>
            <th className="th-cell">連絡先名</th>
            <th className="th-cell">所属先</th>
            <th className="th-cell">TEL</th>
            <th className="th-cell">携帯</th>
            <th className="th-cell">E-mail</th>
            <th className="th-cell">担当ユーザー</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {contacts.map(contact => (
            <tr key={contact.id} className="table-row is-hoverable">
              <td className="td-cell col-fixed">{contact.id}</td>
              <td className="td-cell">{contact.name}</td>
              <td className="td-cell">{contact.customer.name}</td>
              <td className="td-cell">{contact.tel_number}</td>
              <td className="td-cell">{contact.mobile_number}</td>
              <td className="td-cell">{contact.email}</td>
              <td className="td-cell">{contact.in_charge_user?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
