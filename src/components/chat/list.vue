<template>
  <div id="list">
  	<ul style="padding-left:0px">
  		<li v-for="item in admins" :class="{ active: currentSession? item.username === currentSession.username :false}" :key="item"
		   v-on:click="changeCurrentSession(item)">
		   <!--   :class="[item.id === currentSession ? 'active':'']" -->
			 <el-badge :is-dot="idDot[user.username +'#'+item.username]" class="item"> <p class="name">{{item.name}}</p></el-badge>	
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data () {
    return {
     user: JSON.parse(window.sessionStorage.getItem("user"))
    }
  },
  computed: mapState([
   'idDot',
    'admins',
    'currentSession'
	]),
  methods:{
  	changeCurrentSession:function (currentSession) {
  		this.$store.commit('changeCurrentSession',currentSession)
  	}
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {
		padding: 0px 15px;
		border-bottom: 1px solid #292C33;
		cursor: pointer;
		&:hover {
			background-color: rgba(255, 255, 255, 0.03);
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: rgba(255, 255, 255, 0.1);
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
		display: inline-block;
		margin-left: 15px;
	}
}
</style>
