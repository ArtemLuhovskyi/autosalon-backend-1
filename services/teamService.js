const Team = require('../db/models/Team.js');

class TeamService {
    constructor() {
        this.teamModel = Team;
    }
    async getAllTeams() {
        return await this.teamModel.findAll();
    }
    async createTeam(team) {
        return await this.teamModel.create(team);
    }
    async updateTeam(id, team) {
        return await this.teamModel.update(team, {
            where: {
                id: id
            }
        });
    }
    async deleteTeam(id) {
        return await this.teamModel.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = TeamService;