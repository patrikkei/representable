// Adapted from: https://www.valentinog.com/blog/drf/
class OrganizationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading",
    };
  }

  componentDidMount() {
    fetch("api/organizations")
      .then((response) => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then((data) => {
        this.setState(() => {
          return {
            data,
            loaded: true,
          };
        });
      });
  }

  render() {
    return (
      <ul>
        {this.state.data.map((organization) => {
          return <li key={organization.id}>{organization.name}</li>;
        })}
      </ul>
    );
  }
}

export default OrganizationList;
