package com.novacloud.novaone.service;
 
public interface ITeamService extends IServiceInterface {

	String addTeam();

	String deleteTeam();

	String updateTeamInfo();

	String requestJoinTeam();

	String processJoinTeam();

	String deleteFromTeam();

	String leaveFromTeam();

	String getTeamInfo();

	String getMemberTeams();

	String getTeamDefinitions();  	
	 
}
