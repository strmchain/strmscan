<template>
    <div
        v-if="loading"
        :class="(loading ? 'strm-loading strm-loading--full' : '')"/>
    <section v-else>
        <div
            v-if="total == 0"
            class="strm-empty">
            <i class="fa fa-file-text-o strm-empty__icon"/>
            <p class="strm-empty__description">No verified contract found</p>
        </div>

        <p
            v-if="total > 0"
            class="strm-total-items">
            Total {{ _nFormatNumber('verified contract', 'verified contracts', total) }} found
        </p>

        <table-base
            v-if="total > 0"
            :fields="fields"
            :items="items"
            class="strm-table--contracts">

            <template
                slot="hash"
                slot-scope="props">
                <nuxt-link
                    :to="{name: 'address-slug', params: {slug: props.item.hash}}"
                    class="text-truncate">{{ props.item.hash }}</nuxt-link>
            </template>

            <template
                slot="contractName"
                slot-scope="props">{{ props.item.contractName }}</template>

            <template
                slot="compiler"
                slot-scope="props">
                <span>{{ props.item.compiler }}</span>
            </template>

            <template
                slot="createdAt"
                slot-scope="props">
                <span>{{ $moment(props.item.createdAt).format('ll') }}</span>
            </template>
        </table-base>

        <b-pagination
            v-if="total > 0 && total > perPage"
            v-model="currentPage"
            :total-rows="pages * perPage"
            :per-page="perPage"
            align="center"
            class="strm-pagination"
            @change="onChangePaginate"/>
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import TableBase from '~/components/TableBase'

export default {
    components: {
        TableBase
    },
    mixins: [mixin],
    data () {
        return {
            fields: {
                hash: { label: 'Address' },
                contractName: { label: 'ContractName' },
                compiler: { label: 'Compiler' },
                createdAt: { label: 'Date Verified' }
            },
            loading: true,
            total: 0,
            items: [],
            currentPage: 1,
            perPage: 20,
            pages: 1
        }
    },
    mounted () {
        const self = this
        // Init breadcrumbs data.
        self.$store.commit('breadcrumb/setItems', { name: 'contracts', to: { name: 'contracts' } })

        self.getDataFromApi()
    },
    methods: {
        async getDataFromApi () {
            const self = this

            // Show loading.
            self.loading = true

            const params = {
                page: self.currentPage,
                limit: self.perPage
            }

            if (self.address) {
                params.address = self.address
            }

            const query = this.serializeQuery(params)
            const { data } = await this.$axios.get('/api/contracts' + '?' + query)
            self.items = data.items
            self.total = data.total
            self.pages = data.pages

            // Hide loading.
            self.loading = false

            return data
        },
        onChangePaginate (page) {
            this.currentPage = page
            this.getDataFromApi()
        }
    },
    head: () => ({
        title: 'Verified Contracts'
    })
}
</script>
